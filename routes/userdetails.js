// Import the express module
const express = require('express');
const AuthenticateRoutes = require('../middleware/auth')

// Create a router instance
const router = express.Router(); 
const signup = require('../controller/userdetails')

const Recipe = require('../controller/recipe')
router.post('/registeruser',signup.postUserdetails)
router.post('/isValidUser',signup.isValidUser)

//submit Recipe 
router.post('/submitRecipe',AuthenticateRoutes.protect,Recipe.submitRecipe) 
//get Recipe
router.get('/getAllRecipes',AuthenticateRoutes.protect,Recipe.getAllRecipes)
//search Recipe 
router.get('/searchRecipe',AuthenticateRoutes.protect,Recipe.searchRecipe)
                
module.exports = router ;
