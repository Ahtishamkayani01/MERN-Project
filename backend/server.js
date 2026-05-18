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
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mern-project-beta-six.vercel.app",
  "https://mern-backend-virid.vercel.app",
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin?.includes('vercel.app')) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Allow all for now
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());
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

// Database connection middleware
let dbConnected = false;

const ensureDbConnection = async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error);
      // Don't block the request, just log
    }
  }
  next();
};

// Apply database connection to routes that need it
app.use("/api/auth", ensureDbConnection);
app.use("/api/form", ensureDbConnection);
app.use("/api/admin", ensureDbConnection);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);
app.use("/api/admin", adminRoute);

// Error handling
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Export for Vercel
module.exports = app;