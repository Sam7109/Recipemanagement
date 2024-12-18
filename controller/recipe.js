const Recipe = require("../model/recipe");

exports.submitRecipe = async (req, res) => {
    try {
        const iscreatedby = req.user.id;
        const { description, ingredients, instructions, cookingtime, serving, difficulty, imageUrl } = req.body;

        // Validate if all fields are provided
        if (!description || !ingredients || !instructions || !cookingtime || !serving || !difficulty) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate if imageUrl is provided
        if (!imageUrl) {
            return res.status(400).json({ message: "Image URL is required for the recipe" });
        }

        // Optional: Validate data types, like making sure cookingtime and serving are valid numbers if required.
        if (isNaN(cookingtime) || isNaN(serving)) {
            return res.status(400).json({ message: "Cooking time and servings must be numeric" });
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
            iscreatedby
        });

        return res.status(201).json({ message: "Recipe submitted successfully", data: recipe });
    } catch (error) {
        console.error("Error submitting recipe:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};





exports.getAllRecipes = async (req, res) => {
    try {
        // Fetch all recipes from the database
        const recipes = await Recipe.findAll();  // Using Sequelize method

        // Check if recipes exist
        if (!recipes || recipes.length === 0) {
            return res.status(404).json({ message: "No recipes found" });
        }

        // Map over the recipes to add the imageUrl field if needed
        const recipeWithImageUrls = recipes.map(recipe => {
            return {
                ...recipe.dataValues, // get all the attributes
                imageUrl: recipe.image ? recipe.image : null,  // Assuming the image URL is stored in the image field
            };
        });

        // Return the list of recipes along with image URLs
        return res.status(200).json(recipeWithImageUrls);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving recipes" });
    }
};
