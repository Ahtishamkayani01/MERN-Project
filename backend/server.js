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

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://mern-project-beta-six.vercel.app",
    "https://mern-backend-virid.vercel.app",
    /\.vercel\.app$/
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// REMOVED the problematic line - don't use app.options("*", cors())
// app.options("*", cors());  // ← DELETE OR COMMENT THIS LINE

app.use(express.json());

// Test routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.json({ 
    message: "API is working",
    endpoints: ["/api/auth", "/api/form", "/api/admin", "/api/health"]
  });
});

// Your actual routes
app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);
app.use("/api/admin", adminRoute);

app.use(errorMiddleware);

// Connect to database
let dbConnected = false;

const ensureDbConnection = async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error);
    }
  }
  next();
};

app.use(ensureDbConnection);

// 404 handler - also avoid using '*' here
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Export for Vercel serverless function
module.exports = app;