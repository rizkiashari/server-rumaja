import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import router from "./src/routes/index.js";

const app = express();
const env = dotenv.config().parsed;

const PORT = env.PORT || 8881;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

/* API V1 */
app.use("/api", router);

app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}!`));
