import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import typeRoutes from "./routes/typeRoutes.js";
import statusRoutes from "./routes/statusRoutes.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json())


// Test route
app.get("/", (req, res) => {
  res.json({ message: "PTCGP backend running ✅" });
});


app.use("/", roleRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", typeRoutes);
app.use("/", statusRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
