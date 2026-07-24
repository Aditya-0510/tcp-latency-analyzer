const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const errorMiddleware = require("./middleware/errorMiddleware");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

module.exports = app;