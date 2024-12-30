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

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account is inactive. Please contact support." }); // User is blocked
    }

    
    const token = jwt.sign(
      { id: user.id, email: user.email , role: user.role},
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

exports.toggleUserStatus = async (req, res) => {
  try {
    const { email, isActive } = req.body; // Extract email and isActive from the request body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find the user by email
    const user = await Userdetails.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the isActive field
    user.isActive = isActive;
    await user.save();

    res.status(200).json({ message: 'User status updated successfully', user });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
};