'use strict'

const COFFEE_API_URL =
  process.env.COFFEE_API_URL || 'https://api.sampleapis.com/coffee/hot'
const axios = require('axios')

class Coffee {
  constructor (id, title, description, ingredients, image) {
    this.id = id
    this.title = title
    this.description = description
    this.ingredients = ingredients
    this.image = image
  }

  static getCoffees () {
    let coffees = []
    return axios
      .get(COFFEE_API_URL)
      .then(response => response.data)
      .then(response => {
        response.forEach(coffee => {
          coffees.push(
            new Coffee(
              coffee.id,
              coffee.title,
              coffee.description,
              coffee.ingredients,
              coffee.image
            )
          )
        })
        return coffees
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
  }

  static getCoffeeById (id) {
    return axios
      .get(COFFEE_API_URL + `/${id}`)
      .then(response => response.data)
      .then(coffee => {
        return new Coffee(
          coffee.id,
          coffee.title,
          coffee.description,
          coffee.ingredients,
          coffee.image
        )
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
  }
}

module.exports = {
  Coffee: Coffee
}
