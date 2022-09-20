const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./src/routes/index.js");

const app = express();
const env = dotenv.config().parsed;

const PORT = env.PORT || 8881;

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());

/* API V1 */
app.use("/api", router);

app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}!`));
