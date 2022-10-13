# Lehoax-nodejs-authentification-api

# Simple Node JS api with JWT and Mongoose authentication

`:wave:`

## Start 

    # NPM
    npm install
    npm start
    

### for run this app you need to create .env file like below

    ACCESS_TOKEN_SECRET=<YOUR TOKEN>
    REFRESH_TOKEN_SECRET=<YOUR TOKEN>
    DB_ACCESS=<YOUR DB ACCESS>
    DB_PASSWORD=<YOUR DB PASSWORD>

## Public routes

    POST http://localhost:3000/api/user/login
    POST http://localhost:3000/api/user/signup
    GET http://localhost:3000/api/user/profile
    GET http://localhost:3000/api/user/allUser
    

## Routes with authentication

    PUT http://localhost:3000/api/user/update
    DELETE http://localhost:3000/api/user/delete
    GET http://localhost:3000/api/me
