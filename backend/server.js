require("dotenv").config();
const express = require("express");
const errorMiddleware = require("./middlewares/error-middleware");
//change ports issue fix DNS error
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const app = express();
const authRoute = require("./routes/auth-route");
const contactRoute=require("./routes/contact-route")
const connectDB = require("./utils/db");
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);

app.use(errorMiddleware);
connectDB().then(() => {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
  });
});
