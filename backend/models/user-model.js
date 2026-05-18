const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email:    { type: String, required: true },
  phone:    { type: String, required: true },
  password: { type: String, required: true },
  isAdmin:  { type: Boolean, default: false },
});

// ✅ Mongoose 9 style: async pre-save without next()
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate JWT
userSchema.methods.generateToken = function () {
  const secretKey = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
  if (!secretKey) throw new Error("JWT secret key is not defined");
  return jwt.sign(
    { userId: this._id.toString(), email: this.email, isAdmin: this.isAdmin },
    secretKey,
    { expiresIn: "30d" }
  );
};

// Compare password at login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;