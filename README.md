# Capstone Project Backend
This backend is having to schemas for user and recipes, where I have added method for adding editing deleting recipes by owner and to get entire list of recipes for guest. We can get list of recipes of particular user as well. 

Similarly it is having methods to sign up and login user. We can retrieve entire list of users, also we can retrive particular user using ID.


## Technologies
1. Node.js
2. Express.js
3. MongoDB
4. Mongoose
5. cors
6. dotenv
7. morgan
8. multer


## Installation And dependencies
- npm init -y
- npm i express mongoose dotenv morgan cors mylter
- add .gitignore
- add .env
- create folder models
- create folder routes
- inside package.json 
	1) add "type": "module",
	2) "scripts": {
    		"dev": "nodemon index.js",
    		"start": "node index.js"
  		},
- add index.js

## Schemas and API's
- Created two Schemas "User" and "Recipes"
- Added API route's to get(GET), add(POST), edit(PUT), delete(DELETE) data from database
- Providing user sign up login functionality. User can create account and after that login and add, edit or delete own recipe's
- Using jwtoken to keep user authentication 
- Providing image upload functionality to post image using multer middelware.


## Links
- https://expressjs.com/en/resources/middleware/multer.html