const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 1313;
const router = require("./src/routes");
const { sequelize } = require("./src/models");
const authMiddleware = require("./src/middleware/authMiddleware");
const console1Middleware = require("./src/middleware/console1Middleware");
const console2Middleware = require("./src/middleware/console2Middleware");

app.use(express.json());
app.use(express.static("src/storage/uploads"));
// app.use(authMiddleware);
app.use(console2Middleware);
app.use(console1Middleware);
app.use(router);
app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log(`Server berjalan di https://localhost:${port}`);
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});