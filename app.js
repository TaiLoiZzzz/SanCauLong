
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const errorHandler = require("./src/middleware/errorHandler");
const authRoutes = require('./src/modules/auth/auth.routes');
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// error middleware
app.use(errorHandler);

module.exports = app;