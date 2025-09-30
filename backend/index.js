import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware/auth.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
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
  try {
    const { name } = req.body;
    const role = await prisma.role.create({ data: { name } });
    res.json(role)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create role." });
  }
})


// -------- SIGNUP --------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;

    // find user
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    // find role (default: user)
    const role = await prisma.role.findUnique({ where: { name: roleName || "user" } });
    if (!role) {
      return res.status(400).json({ error: "Role not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        roleID: role.id,
      },
      select: { id: true, email: true, name: true, role: true }
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create user." });
  }
});


// -------- SIGNIN --------
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  // Check if password matches
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  // Create token
  const token = jwt.sign(
    { userId: user.id, roleId: user.roleID },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 3600000 // 1 hour
  });

  res.json({ message: "Signed in successfully", token });
});


// -------- LOGOUT --------
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });
  res.json({ message: "Logged out" });
});


// -------- PROTECTED EXAMPLE --------
app.get("/profile", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, name: true, email: true, role: true }
  });
  res.json(user);
});


// -------- LOGIN CHECK ----------
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, role: { select: { name: true } } },
    });
    res.json({
      name: user.name,
      email: user.email,
      role: user.role.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch user." });
  }
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
