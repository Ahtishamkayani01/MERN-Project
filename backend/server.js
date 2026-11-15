require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error-middleware");
const connectDB = require("./utils/db");

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const authRoute = require("./routes/auth-route");
const contactRoute = require("./routes/contact-route");
const adminRoute = require("./routes/admin-route");

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

// Ensure the DB is connected before any DB-backed route.
// If it fails, answer with JSON (CORS headers still apply) instead of crashing.
const requireDB = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ message: "Database unavailable", error: err.message });
  }
};
app.use(["/api/auth", "/api/form", "/api/admin"], requireDB);

// Your actual routes
app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);
app.use("/api/admin", adminRoute);

app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Locally: start a normal server. On Vercel the exported app is used instead.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  connectDB().catch(() => {}); // warm up; errors are reported per request
}

// Export for Vercel serverless
module.exports = app;