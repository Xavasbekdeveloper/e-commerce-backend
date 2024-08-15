import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import router from "./router/index.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB is connected"))
  .catch(() => console.log("MongoDB is not connected"));

app.use("/", router);

app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static("./upload"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`${PORT} has been listening`));
