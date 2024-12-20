const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const router = require("./src/routes/index.js");

const app = express();
const env = dotenv.config().parsed;

const PORT = env.PORT || 8881;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.render("index");
});

/* API V1 */
app.use("/api", router);

app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}!`));
