import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
  res.json({ message: "PTCGP backend running ✅" });
});

// -------- ROLES --------
app.get("/roles", async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      select: { name: true }
    });
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not get roles." });
  }
});

app.post("/role", async (req, res) => {
  try 
  {
    const { name } = req.body;
    const role = await prisma.role.create({ data: { name } });
    res.json(role)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create role."});
  }
})



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
