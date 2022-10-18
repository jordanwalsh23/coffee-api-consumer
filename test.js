'use strict'
const assert = require('chai').assert;
let Coffee = require('./index').Coffee;

describe('Coffee Tests', () => {
  it('Gets a list of coffees', (done) => {
    Coffee.getCoffees()
      .then(coffees => {
        assert(coffees.length > 0, 'There are no coffees in the database.')
        coffees.forEach(coffee => {
          assert(coffee.id, 'Coffee has no ID.')
          assert(coffee.title, 'Coffee has no Title.')
          assert(coffee.description, 'Coffee has no Description.')
          assert(coffee.ingredients, 'Coffee has no Ingredients.')
          assert(coffee.image, 'Coffee has no Image.')
        })
        done();
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  })

  it('Gets an individual coffee', (done) => {
    Coffee.getCoffeeById(1)
      .then(coffee => {
        assert(coffee.id, 'Coffee has no ID.')
        assert(coffee.title, 'Coffee has no Title.')
        assert(coffee.description, 'Coffee has no Description.')
        assert(coffee.ingredients, 'Coffee has no Ingredients.')
        assert(coffee.image, 'Coffee has no Image.')

        done();
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  })
})
