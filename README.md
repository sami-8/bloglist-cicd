## BlogList CI/CD

My submission for Full Stack Open's exercises [11.21-11.22](https://fullstackopen.com/en/part11/expanding_further#exercises-11-20-11-22).

Other exercises are in [this repository](https://github.com/sami-8/full-stack-open-pokedex).

## Configuration and dependencies

This project requires a file named ".env" at the root, with the following content:
```
MONGODB_URI=MongoDB address for development or production
TEST_MONGODB_URI=MongoDB address for tests
SECRET=Needed for JsonWebToken. Can be any string.
```

Install dependencies:
```
$ npm install
```

## Running in development mode
```sh
# Start the client/React app
$ npm run client

# Start the Express server
$ npm run server
```

## Running in production mode
```sh
# Create a production build
$ npm run build

# Run the application
$ npm start
```

## Server tests
```sh
$ npm run test
```

## E2E tests with a production build
```sh
# Create a production build
$ npm run build

# Start the application in test mode
$ npm run start:test

# Run the tests
$ npm run test:e2e
```
