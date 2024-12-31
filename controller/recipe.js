const Recipe = require("../model/recipe");
const { Op } = require('sequelize');

const Userdetails = require("../model/userdetails");

const { Sequelize } = require("sequelize");

exports.submitRecipe = async (req, res) => {
  try {
    const iscreatedby = req.user.id;
    const {
      description,
      ingredients,
      instructions,
      cookingtime,
      serving,
      difficulty,
      imageUrl,
    } = req.body;

    // Validate if all fields are provided
    if (
      !description ||
      !ingredients ||
      !instructions ||
      !cookingtime ||
      !serving ||
      !difficulty
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate if imageUrl is provided
    if (!imageUrl) {
      return res
        .status(400)
        .json({ message: "Image URL is required for the recipe" });
    }

    // Optional: Validate data types, like making sure cookingtime and serving are valid numbers if required.
    if (isNaN(cookingtime) || isNaN(serving)) {
      return res
        .status(400)
        .json({ message: "Cooking time and servings must be numeric" });
    }

    // Store the recipe along with the image URL from S3
    const recipe = await Recipe.create({
      description,
      ingredients,
      instructions,
      cookingtime,
      serving,
      difficulty,
      image: imageUrl, // Store the image URL (from S3)
      iscreatedby,
    });

    return res
      .status(201)
      .json({ message: "Recipe submitted successfully", data: recipe });
  } catch (error) {
    console.error("Error submitting recipe:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    // Fetch all recipes from the database
    const recipes = await Recipe.findAll(); // Using Sequelize method

    // Check if recipes exist
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found" });
    }

    // Map over the recipes to add the imageUrl field if needed
    const recipeWithImageUrls = recipes.map((recipe) => {
      return {
        ...recipe.dataValues, // get all the attributes
        imageUrl: recipe.image ? recipe.image : null, // Assuming the image URL is stored in the image field
      };
    });

    // Return the list of recipes along with image URLs
    return res.status(200).json(recipeWithImageUrls);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving recipes" });
  }
};

exports.searchRecipe = async (req, res) => {
  try {
    const { query } = req.query;
    const recipe = await Recipe.findAll({
      where: {
        description: {
          [Sequelize.Op.like]: `%${query}%`,
        },
      },
    });
    if (recipe.length === 0 || !recipe) {
      return res.status(404).json({ message: "No recipes found" });
    }
    return res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving recipes" });
  }
};

exports.filterByuserProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const recipe = await Recipe.findAll({ where: { iscreatedby: id } });
    if (recipe.length === 0 || !recipe) {
      return res.status(404).json({ message: "No recipes found" });
    }
    return res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving recipes" });
  }
};


exports.recipeFilters = async (req, res) => {
  try {
    const { difficulty, cookingTime } = req.query; // Match `cookingTime` from the frontend
    // Build the where clause for filtering
    let whereClause = {};

    // Add difficulty to the where clause if provided
    if (difficulty) {
      whereClause.difficulty = difficulty.trim(); // Trim whitespace for consistency
    }

    // Add cookingTime to the where clause if provided
    if (cookingTime) {
      whereClause.cookingtime = { [Op.lte]: parseInt(cookingTime) }; // Use Sequelize Op for <= comparison
    }

    // Query the database with the constructed where clause
    const recipes = await Recipe.findAll({ where: whereClause });

    // Return the filtered recipes
    res.status(200).json({ recipes });
  } catch (error) {
    console.error('Error retrieving recipes:', error);
    res.status(500).json({ message: "Error retrieving recipes", error });
  }
};


exports.adminPanel = async (req, res) => {
  try {
    const userDetails = await Userdetails.findAll({
      attributes: ["email", "isActive"],
    });
    if (userDetails.length === 0 || !userDetails) {
      return res.status(404).json({ message: "No user found" });
    }
    return res.status(200).json(userDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving recipes" });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params; // Get the recipe ID from the URL parameter
    const updatedRecipe = req.body; // Get the updated recipe details from the request body

    // Find the recipe by ID
    const recipe = await Recipe.findOne({ where: { id: recipeId } });

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    // Update the recipe with the new data
    await recipe.update(updatedRecipe);

    return res
      .status(200)
      .json({ success: true, message: "Recipe updated successfully", recipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update recipe" });
  }
};
