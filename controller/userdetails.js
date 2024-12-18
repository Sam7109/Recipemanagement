const Userdetails = require("../model/userdetails");
const bcrypt = require("bcryptjs"); // bcrypt to compare passwords
const { config } = require("dotenv");

const jwt = require("jsonwebtoken"); // for token generation
require("dotenv").config();

exports.postUserdetails = async (req, res) => {
  try {
    const { username, email, password} = req.body;

    const existingUser = await Userdetails.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" }); // Ensure return after response
    }

    const userDetails = await Userdetails.create({
      username: username,
      email: email,
      password: password,
    });

    return res.status(201).json({ message: "User registered Successfully", data: userDetails });
  } catch (error) {
    return res.status(500).json({ message: error.message }); // Ensure return after response
  }
};

exports.isValidUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Userdetails.findOne({ where: { email } });
    if (!user) {
      return res.status(500).json({ message: "User does not exist" }); // Ensure return after response
    }

    const userPass = await bcrypt.compare(password, user.password);
    if (!userPass) {
      return res.status(400).json({ message: "Invalid password" }); // Ensure return after response
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    if (!user.userid) {
      await Userdetails.update({ userid: user.id }, { where: { id: user.id } });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message }); // Ensure return after response
  }
};
