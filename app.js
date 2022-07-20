const express = require("express");

const app = express();

app.use("/movies", require("./routes/movies"));
app.use("/actor_stats", require("./routes/actors"));

module.exports = app;
