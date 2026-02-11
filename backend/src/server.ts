import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { sql } from "./config/db";
import authRoutes from "./routes/auth";
import progressRoutes from "./routes/progress";



const app = express();
app.use(cors());
app.use(express.json());

app.use("/progress", progressRoutes);

app.use("/auth", authRoutes);


app.get("/", (_, res) => {
  res.send("Backend running");
});

sql`SELECT NOW()`
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB connection error", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
