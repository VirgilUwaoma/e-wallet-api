### Introduction

### Getting Started

- Base URL: This Backend API Sever is hosted on Heroku and has a base URL [`https://gentle-lowlands-65053.herokuapp.com/`.](https://gentle-lowlands-65053.herokuapp.com/.)
- Authentication: This version of the application does not require authentication or API keys.

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

### Resource Endpoint Library

#### GET /api/v1/users

- Returns json containing success value, successful login message and authentication token string(needed to make calls to the user wallet endpoint)
- Requires a request body JSON of a valid user email and password
- Sample:

```plaintext
{
    "message": "login successful",
    "success": true
}
```

#### GET /api/v1/auth/login

- Returns json containing success value, successful login message and authentication token string(needed to make calls to the user wallet endpoint)
- Requires a request body JSON of a valid user email and password
- Sample:

```plaintext
{
    "message": "login successful",
    "token": <token string>,
    "success": true
}
```

#### GET /api/v1/auth/register

- Returns json containing success value, successful login message and authentication token string(needed to make calls to the user wallet endpoint)
- Requires a request body JSON of a valid user email and password
- Sample:

```plaintext
{
	"message": "Created account for User 1",
	"success": true
}
```

g
