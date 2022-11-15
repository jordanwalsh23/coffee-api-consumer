'use strict'
const assert = require('chai').assert
let Coffee = require('./index').Coffee;

const PostmanMockBuilder = require('@jordanwalsh23/postman-mock-builder')

let mockServer = null

describe('Coffee Tests', () => {
  before(() => {
    //Create a mock server.
    mockServer = PostmanMockBuilder.create({
      apiVersion: 'v1'
    })

    //Set the states you expect the system to be in.
    let hasCoffeesState = mockServer.addState('Database has a list of coffees.')

    let hasNoCoffeesState = mockServer.addState('Database has no coffees.')

    //Add requests and responses to each of the states.
    //STATE #1 - Has Coffees in the DB
    let hasCoffeesRequest = hasCoffeesState.addRequest({
      method: 'GET',
      path: '/coffee/hot',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    let hasCoffeesResponse = hasCoffeesRequest.addResponse({
      status: 200,
      body: [
        {
          title: 'Black',
          description:
            'Black coffee is as simple as it gets with ground coffee beans steeped in hot water, served warm. And if you want to sound fancy, you can call black coffee by its proper name: cafe noir.',
          ingredients: ['Coffee'],
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/640px-A_small_cup_of_coffee.JPG',
          id: 1
        },
        {
          title: 'Latte',
          description:
            'As the most popular coffee drink out there, the latte is comprised of a shot of espresso and steamed milk with just a touch of foam. It can be ordered plain or with a flavor shot of anything from vanilla to pumpkin spice.',
          ingredients: ['Espresso', 'Steamed Milk'],
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Latte_at_Doppio_Ristretto_Chiang_Mai_01.jpg/509px-Latte_at_Doppio_Ristretto_Chiang_Mai_01.jpg',
          id: 2
        }
      ]
    })

    let hasSingleCoffeeRequest = hasCoffeesState.addRequest({
      method: 'GET',
      path: '/coffee/hot/1',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    let hasSingleCoffeeResponse = hasSingleCoffeeRequest.addResponse({
      status: 200,
      body: {
        title: 'Black',
        description:
          'Black coffee is as simple as it gets with ground coffee beans steeped in hot water, served warm. And if you want to sound fancy, you can call black coffee by its proper name: cafe noir.',
        ingredients: ['Coffee'],
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/640px-A_small_cup_of_coffee.JPG',
        id: 1
      }
    })

    //STATE #2 - Has no Coffees in the DB
    let hasNoCoffeesRequest = hasNoCoffeesState.addRequest({
      method: 'GET',
      path: '/coffee/cold',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    let hasNoCoffeesResponse = hasNoCoffeesRequest.addResponse({
      status: 500
    })

    mockServer.start(5555).then(() => {
      process.env.COFFEE_API_URL = 'http://localhost:5555/coffee'
    })
  })

  it('Gets a list of hot coffees', done => {
    Coffee.getCoffees('hot')
      .then(coffees => {
        assert(coffees.length > 0, 'There are no coffees in the database.')
        coffees.forEach(coffee => {
          assert(coffee.id, 'Coffee has no ID.')
          assert(coffee.title, 'Coffee has no Title.')
          assert(coffee.description, 'Coffee has no Description.')
          assert(coffee.ingredients, 'Coffee has no Ingredients.')
          assert(coffee.image, 'Coffee has no Image.')
        })
        done()
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  })

  it('Gets an individual hot coffee', done => {
    Coffee.getCoffeeById('hot', 1)
      .then(coffee => {
        assert(coffee.id, 'Coffee has no ID.')
        assert(coffee.title, 'Coffee has no Title.')
        assert(coffee.description, 'Coffee has no Description.')
        assert(coffee.ingredients, 'Coffee has no Ingredients.')
        assert(coffee.image, 'Coffee has no Image.')

        done()
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  })

  it('Gets a list of cold coffees', done => {
    Coffee.getCoffees('cold')
      .then(coffees => {
        assert(coffees.length == 0);
        done()
      })
      .catch(err => {
        console.log("Error received - passing.")
        done(err)
      })
  })

  after(() => {
    mockServer.exportCollection("postman/collection.json")
    mockServer.stop()
  })
})
