const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/seq');

const Recipe = sequelize.define('Recipe', {
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    ingredients: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false, // Remove uniqueness constraint unless required
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    cookingtime: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serving: {
        type: DataTypes.STRING,
        allowNull: false
    },
    difficulty: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING, // Storing the file path as a string
        allowNull: true
    },
    iscreatedby: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false // Consider making this `false` unless one user can only have one recipe
    }
});

module.exports = Recipe;
