const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to Home page");
  } catch (error) {
    console.log(error);
  }
};

//User Register
const register = async (req, res) => {
  try {
    const { userName, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "email already exists" });
    }
    //hash the password
    // const saltRound = 10;
    // const hash_password = await bcrypt.hash(password, saltRound);
    const userCreated = await User.create({
      userName,
      email,
      phone,
      password,
    });
    res.status(201).json({
      message: "registration successful",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "page not found" });
  }
};

//User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await userExist.compareCredentials(password);
    if (isMatch) {
      res.status(200).json({
        message: "Login successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    const status = 422;
    const message = "Fill the input properly";
    const extraDetails = err.errors[0].message;
    const error = {
      status,
      message,
      extraDetails,
    };
    console.log(error);
    // res.status(400).json({ msg: message });
    next(error);
  }
};

module.exports = { home, register, login };
