const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const URI = process.env.MONGODB_URI; // ← move it here, inside the function
    await mongoose.connect(URI);
    console.log("connection successful to DB");
  } catch (error) {
    console.log("database connection failed", error.message); // log the actual error too
    process.exit(0);
  }
};

module.exports = connectDB;