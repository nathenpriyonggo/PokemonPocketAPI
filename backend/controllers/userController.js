import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { 
                id: true,
                email: true,
                name: true,
                passwordHash: true,
                role: { select: { name: true } },
                createdAt: true,
                updatedAt: true,
            }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not get users." });
    }
}


export const getUserByName = async (req, res) => {
    const { name: userName } = req.body;
        if (!userName) {
            return res.status(400).json({ error: "Name is required." });
        }
    try {
        const user = await prisma.user.findFirst({
            where: {
                name: userName
            },
            select: {
                id: true,
                email: true,
                name: true,
                passwordHash: true,
                role: { select: { name: true } },
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: `User with name ${userName} not found` });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not get named user." });
    }
}


export const postUser = async (req, res) => {
    try {
        const { name, email, password, roleName } = req.body;

        // Unique email for each user
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }

        // Post with no roleName defaults to USER
        const role = await prisma.role.findUnique({ where: { name: roleName || "USER"}});
        if (!role) {
            return res.status(400).json({ error: "Role not found" });
        }

        // Password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, passwordHash: hashedPassword, roleID: role.id }
        });
        res.json(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not create user." });
    }
}