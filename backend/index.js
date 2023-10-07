import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { connectDB } from "./DB/Database.js";

dotenv.config({path: "./config/config.env"});
const app = express();
const port = process.env.PORT;

connectDB();

// Middleware
app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/cat", (request, response) => {
    response.send("Hello World!");
})

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
})