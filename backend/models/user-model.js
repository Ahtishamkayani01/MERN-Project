const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

//password hash
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
    next();
  } catch (error) {
    next(error);
  }
});

//json web token - FIXED: Use JWT_SECRET_KEY or JWT_SECRET consistently
userSchema.methods.generateToken = function () {
  try {
    const secretKey = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT secret key is not defined");
    }
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
      },
      secretKey,
      {
        expiresIn: "30d",
      },
    );
  } catch (error) {
    console.log("Token generation error:", error);
  }
};

//Login password match - FIXED method name and logic
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Password comparison error:", error);
    return false;
  }
};

// Also keep compareCredentials for compatibility
userSchema.methods.compareCredentials = async function (password) {
  return await this.comparePassword(password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;