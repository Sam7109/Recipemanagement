// Import the express module
const express = require('express');
const AuthenticateRoutes = require('../middleware/auth')
const adminAuth = require('../middleware/adminauth')
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
           
//find recipe by id
router.get('/findRecipe',AuthenticateRoutes.protect,Recipe.filterByuserProfile)

//recipe Filters
router.get('/filterRecipe',AuthenticateRoutes.protect,Recipe.recipeFilters)      

//Admin Panel 
router.get('/adminPanel',adminAuth.verifyAdmin,Recipe.adminPanel)  
router.patch('/updateAccountStatus',adminAuth.verifyAdmin,signup.toggleUserStatus)

//edit recipes 
router.put('/editRecipe/:recipeId',AuthenticateRoutes.protect,Recipe.updateRecipe)

module.exports = router ;
