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
    next();
  }
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    next(error);
  }
});

//json web token
userSchema.methods.generateToken = function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      },
    );
  } catch (error) {
    console.log(error);
  }
};

//Login password match
userSchema.methods.compareCredentials = async function (password) { // ✅ accept plain password
  try {
    return await bcrypt.compare(password, this.password); // ✅ bcrypt not jwt
  } catch (error) {
    console.log(error);
  }
};

//define model or collection name
const User = mongoose.model("User", userSchema);
module.exports = User;
