require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

pool.connect()
  .then(() => {
    console.log("PostgreSQL database connected successfully");
  })
  .catch((error) => {
    console.log("Database connection failed:");
    console.log(error.message);
  });

// Routes
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

app.use(express.static("public"));

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Todo API is working"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});