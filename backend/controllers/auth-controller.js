const User = require("../models/user-model");

const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to Home page");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};

const register = async (req, res) => {
  try {
    const { userName, email, phone, password } = req.body;
    
    // Check if user exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    // Create user
    const userCreated = await User.create({ userName, email, phone, password });
    
    // Generate token
    const token = await userCreated.generateToken();
    
    res.status(201).json({
      message: "Registration successful",
      token: token,
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.log("Registration error:", error);
    res.status(500).json({ message: "Registration error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    
    if (!userExist) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    
    const isMatch = await userExist.comparePassword(password);
    
    if (isMatch) {
      const token = await userExist.generateToken();
      res.status(200).json({
        message: "Login successful",
        token: token,
        userId: userExist._id.toString(),
        isAdmin: userExist.isAdmin,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

module.exports = { home, register, login };