import express from "express";
import mainRouter from "./routes/index.js";
import cors from "cors"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { config } from "dotenv"

config()

await mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Connection successful ");
})

const app = express();
const port = process.env.PORT || 3000;
app.use(cors())
app.use(bodyParser.json())

app.use("/api/v1", mainRouter)

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
})