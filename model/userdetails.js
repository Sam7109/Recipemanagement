const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('../utils/seq')

const Userdetails = sequelize.define('Userdetails', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique : false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true  // Ensures the email is in the correct format
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userid : {
        type : DataTypes.INTEGER ,
        allowNull : true ,
        unique : true
    }
});

Userdetails.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

module.exports = Userdetails

