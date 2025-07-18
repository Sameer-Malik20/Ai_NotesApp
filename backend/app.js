import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/NotesRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("hello world");
});

const ConnecDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("ConnectDB");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
ConnecDB();

app.use("/api", router);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is running on ${PORT}`));
