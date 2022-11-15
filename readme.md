## Coffee API Consumer

This is a sample project to demonstrate how to implement Consumer Driven Contract Testing using Javascript and Postman collections.

### Our Goal

We want to improve our tests in two key ways:

1. We want to reduce the dependency on our downstream services to improve our test speeds.

2. We want to create tests that can be sent to our downstream provider so they can understand how you're using their services.

These can be achieved through CDCT.

In this repo you'll find two directories:

- Initial - contains a version of the project that doesn't implement any CDCT.
- Final - contains a version of the project that implements CDCT.

The goal is to update the `Initial` folder to implement CDCT so you can then do this in your own projects.

## TL;DR - Skip to the end.

Clone the repo, open the `final` folder in your CLI and run the following command.

```bash
npm install && mocha
```

The console will run the tests and and show you the following output:

```sh
Coffee Tests
Server listening on http://localhost:5555
Server supports the following routes:
[
  'GET /get',
  'GET /coffee/cold',
  'GET /coffee/hot',
  'GET /coffee/hot/1'
]
    ✔ Gets a list of hot coffees
    ✔ Gets an individual hot coffee
    ✔ Gets a list of cold coffees


  3 passing (56ms)
```

This has done a few things:

1. Created a local server (on localhost:5555).
2. Registered several endpoints on that server.
3. Executed tests against the local server and passed all assertions.
4. Generated a Postman Collection that represents these tests in the folder `postman/collection.json`.


## The slow way.

Open the `initial` folder and notice that you've got two key files:

`index.js` - contains the source code for the Coffee API Consumer that you're going to be testing.

`test.js` - contains the tests you need to update to implement CDCT.

You need to improve your tests so that they aren't so dependent on the downstream API being available.

To do this you'll follow these steps:

1. Import the Postman Mock Builder library. 
2. Create a local mock server.
3. Add some requests and responses to the mock server.
4. Update our tests to use our local mock server instead of the downstream service.
5. Export a collection that represents the mock server.

## Getting Started

All of the exercises in this section will be run from the `initial` folder.

```bash
cd initial
```

### Import the Postman Mock Builder

Run the following command to import the Postman Mock Builder library to the project.

```bash
npm install @jordanwalsh23/postman-mock-builder
```

Update the `test.js` file to include this code:

```javascript
const PostmanMockBuilder = require('@jordanwalsh23/postman-mock-builder')

let mockServer = null
```

The mock server is now ready to be instantiated.

### Create the Local Mock Server

You can now create a mock server in your test file.  Update your `test.js` to include the following hook:

```javascript
before(() => {
  //Create a mock server.
  mockServer = PostmanMockBuilder.create({
    apiVersion: 'v1'
  })
});
```

Your mockServer object is now ready to have some requests and responses added.

### Add requests and responses to the mock

To add requests and responses first you need to set up the expected state of the system you're testing.

Some example states for a system could be:

- Database has correct data.
- Database has no data.
- Database has invalid data.
- etc.

You can consider each system state to come with a collection of requests and sample responses that will occur when the system is in this state.

E.g. if the state is `database has no data` you would expect all requests for records to return a successful result (200 OK) but 0 results.

Alternatively, if you have a state of `database has invalid data` you may expect the system to return an error state (500 Internal Server Error).

To add a state to the system you can use a helper function on the `mockServer` object.

Note: add this code inside the `before` hook of your test.

```javascript
let hasCoffeesState = mockServer.addState('Database has a list of coffees.')
```

You can add as many states as needed to represent how you want the system to behave.

Now that you have a state, you can add requests and responses.

Adding requests is done through a helper method on the state object.

```js
//STATE #1 - Has Coffees in the DB
let hasCoffeesRequest = hasCoffeesState.addRequest({
  method: 'GET',
  path: '/coffee/hot',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})
```

And subsequent responses can be added as a helper function on the request object.

```js
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
```

Now you've set up an example state of the system with an associated request and response.

The last thing to do is actually start the server:

```js
mockServer.start(5555).then(() => {
  process.env.COFFEE_API_URL = 'http://localhost:5555/coffee'
})
```

In this instance I've set the downstream API server URL as an environment variable. This is so that I can replace it dynamically without having to reinstantiate the client object.

### Update the tests to use the mock server

Our tests have an in built API client object that references an environment variable for the API URL.

```js
Coffee.getCoffees('hot')
```

The `getCoffees` method internally has a reference to the `process.env.COFFEE_API_URL` variable.

As you've now changed this variable to point to our mock server, you actually don't need to modify our tests at all.

You can execute your tests now by simply running:

```bash
npm install && mocha
```

At this point you've completely removed any dependency on your downstream API, instead mocking out all of the services they provide and testing this locally.

If you want to turn this into a proper CDCT, then the final step is to export a contract that matches the behaviour of how you are using the system. Fortunately, the postman-mock-builder library has a helper function to do just this.

### Export your collection

You can use the `after` hook to export the collection and stop the server. 

```js
after(() => {
  mockServer.exportCollection("postman/collection.json")
  mockServer.stop()
})
```

Now you are able to send this JSON file to the provider of your API. They can import it into Postman to see exactly how you are using their services.

The exported JSON contains the following:

- A Collection v2.1 formatted file.
- Each state represented as a folder.
- Each request represented as a request within the folder.
- Each response represented as an example response for the related request.

### And that's it! 

You've now updated your project to use local tests which are faster and have reduced your dependencies on your down stream providers.

Your testing will be more robust, and you have a shippable contract (the postman collection) that you can provide to your provider to advise how you're using their services.

## More Info

For more information, check out the [postman-mock-builder](https://www.npmjs.com/package/@jordanwalsh23/postman-mock-builder) project, or reach out to @jordanwalsh23.





