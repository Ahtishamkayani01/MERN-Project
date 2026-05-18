require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error-middleware");

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const authRoute = require("./routes/auth-route");
const contactRoute = require("./routes/contact-route");
const adminRoute = require("./routes/admin-route");
const connectDB = require("./utils/db");

// CORS — allow frontend dev server
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mern-project-beta-six.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);
app.use("/api/admin", adminRoute);

app.use(errorMiddleware);

// Connect to database before handling requests
let dbConnected = false;

const ensureDbConnection = async (req, res, next) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  next();
};

app.use(ensureDbConnection);

// Export for Vercel serverless function
module.exports = app;