const express = require("express");
const userRoutes = require("../routes/UserRoutes");

const app = express();

// Middleware
app.use(express.json()); // Để xử lý dữ liệu JSON

// Routes
app.use("/api/users", userRoutes);

module.exports = app;
