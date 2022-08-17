# E-WALLET-API

## Introduction

This is a backend API server that allows users to create an account with an associated wallet which they can fund, withdraw from and transfer funds to other users using specific endpoint

This application is built using:

- NodeJS
- KnexJS ORM
- MySQL Database

## Getting Started

- Base URL: This Backend API Sever is hosted on Heroku and has a base URL [`https://gentle-lowlands-65053.herokuapp.com/`.](https://gentle-lowlands-65053.herokuapp.com/.)
- Authentication: This version of the application requires jwts token authentication to access some endpoints. This token is generated from the "/api/v1/auth/login " endpoint
- This version of the application limits each IP to 100 requests per \`window\` (20 minutes)

**Project Dependencies**

- express
- bcrypt
- knex
- jsonwebtoken
- mysql
- dotenv
- uuid

**Development Dependencies**

- mocha
- chai
- supertest
- nodemon

## How to setup locally

- Open your terminal and clone this repository using `git clone https://github.com/VirgilUwaoma/e-wallet-api.git`
- Navigate to project folder and install dependencies using `npm install`.
- Create .env file and add environment variables using .env.sample as a guide.
- Run the command `npx knex migrate:latest` to create the tables.
- Open terminal and type `npm run test` to run tests.
- Type `npm run dev` to run server in development mode.
- Type `npm run start` to start server in production mode.
- Use postman and navigate to desired endpoints

### Error

Errors are returned as JSON objects in the following format:

```plaintext
{
    "success": false,
    "message": "bad request"
}
```

The API will return three error types when requests fail:

- 400: Bad Request
- 403: Forbidden
- 409: Conflict

## Resource Endpoint Library

#### GET /api/v1/auth/login

- Returns json containing success value, successful login message and authentication token string(needed to make calls to the user wallet endpoint)
- Requires a request body JSON of a valid user email and password
- Sample response:

```plaintext
{
    "message": "login successful",
    "token": <token string>,//Bearer token
    "success": true
}
```

#### POST /api/v1/auth/register

- Returns json containing success value, successful login message and authentication token string(needed to make calls to the user wallet endpoint)
- Requires a request body JSON of a valid user email and password
- Sample response:

```plaintext
{
    "message": "Created account for User 1",
    "success": true
}
```

#### POST /api/v1/auth/wallet/fund

- Returns json containing success value, amount, balance and transaction id
- Requires a valid request authorization header, bearer token of user(obtained at login) and fund amount in the request JSON body.
- Sample response:

```plaintext
{
    "message": "wallet credited 10000000",
    "balance": 10000000,
    "transaction_id": "9ad9eddd-1d6d-4f0a-96ba-30eb681fa5c7",
    "success": true
}
```

#### POST /api/v1/auth/wallet/withdraw

- Returns json containing success value, amount, balance and transaction id
- Requires a valid request authorization header Bearer Token of user(obtained at login) and withdrawal amount in the request JSON body
- Sample response:

```plaintext
{
    "message": "withdraw successful",
    "amount": 1000000,
    "balance": 7999999.99,
    "transaction_id": "d39890e2-95f8-406d-91d5-9bc3f7a2c21b",
    "success": true
}
```

#### POST /api/v1/auth/wallet/transfer

- Returns json containing success value, amount, balance and transaction id
- Requires a valid request authorization header Bearer Token of user(obtained at login), transfer amount and receiver mobile in the request JSON body
- Sample response:

```plaintext
{
    "message": "transfer successful",
    "recipient_mobile": 2,
    "amount": 1000000,
    "prev_balance": 7999999.99,
    "current_balance": 6999999.99,
    "transaction_id": "d497129e-8e49-4d1c-9b13-67f43c8a79b5",
    "success": true
}
```
