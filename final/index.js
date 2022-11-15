'use strict'

let coffeeApiUrl = 'https://api.sampleapis.com/coffee';
  
const axios = require('axios')

class Coffee {
  constructor (id, title, description, ingredients, image) {
    this.id = id
    this.title = title
    this.description = description
    this.ingredients = ingredients
    this.image = image
  }

  static getCoffees (temp) {
    let coffees = []
    return axios
      .get(this.getUrl() + `/${temp}`)
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
      .catch(() => coffees)
  }

  static getCoffeeById (temp, id) {
    return axios
      .get(this.getUrl() + `/${temp}/${id}`)
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
      .catch(() => {})
  }

  static getUrl() {
    if(process.env.COFFEE_API_URL) {
      return process.env.COFFEE_API_URL;
    } else {
      return coffeeApiUrl;
    }
  }
}

module.exports = {
  Coffee: Coffee
}
