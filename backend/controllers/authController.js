import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const signup = async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "User already exists." });

    const role = await prisma.role.findUnique({ where: { name: roleName || "user" } });
    if (!role) return res.status(400).json({ error: "Role not found" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, passwordHash: hashedPassword, roleID: role.id },
      select: { id: true, email: true, name: true, role: true },
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create user." });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials." });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: "Invalid credentials." });

    const token = jwt.sign({ userId: user.id, roleId: user.roleID }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 3600000 });
    res.json({ message: "Signed in successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not sign in." });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
  res.json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: { select: { name: true } }
      }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      role: user.role.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch user." });
  }
};
