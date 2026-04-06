
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");

const errorHandler = require("./src/middleware/errorHandler");
const authRoutes = require('./src/modules/auth/auth.routes');
const centerRoutes = require('./src/modules/center/center.routes')
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/centers',centerRoutes)

// 404 handler
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// error middleware
app.use(errorHandler);

module.exports = app;