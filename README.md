# Restify Auth Service 
---
## Features
* User registration via email confirmation
* User password reset via email
* Login via Facebook Auth Service
* Login via Google Auth Service
* Login via Github Auth Service
* User management API
* Request/Errors logging
* Request Validation
* User roles

## Used stack
* Joi.js (Validation)
* Passport.js (Authentication)
* Restify.js (Server)
* Nodemailer.js (SMTP)
* Bunyan.js (Logger)
* Mocha.js (Unit Testing)
* Eslint.js (Linter)
* Jsonwebtoken.js (Authentication Token)
* Mongoose.js (mongoDB ORM)

## How to start
##### 1. Install dependencies
```npm install```
##### 2. Change config files
Replace all variables named ```REPLACE_IT``` in file ```config/default.json```
##### 3. Run Service
```npm start```

