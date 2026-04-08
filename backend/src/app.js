const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error.middleware");
const problemRoutes = require("./routes/problem.routes");
const problemSetRoutes = require("./routes/problemset.routes");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.json({ message: "api running" }));

app.use("/api/problems", problemRoutes);
app.use("/api/problem-sets", problemSetRoutes);

app.use(errorMiddleware);

module.exports = app;
