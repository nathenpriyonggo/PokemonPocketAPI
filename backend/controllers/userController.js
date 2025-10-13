import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const USER_SELECTION = {
    id: true,
    email: true,
    name: true,
    passwordHash: true,
    role: { select: { name: true } },
    createdAt: true,
    updatedAt: true,
};

// ===================================
// GET all Users
// ===================================
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: USER_SELECTION
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not get users." });
    }
}

// ===================================
// GET User by Name
// ===================================
export const getUserByName = async (req, res) => {
    try {
        const userName = req.body.name ? req.body.name.trim() : null;

        // Check for empty string
        if (!userName) {
            return res.status(400).json({ error: "Name is required." });
        }
        
        const user = await prisma.user.findFirst({
            where: {
                name: userName
            },
            select: USER_SELECTION
        });
        
        // Check if user not found
        if (!user) {
            return res.status(404).json({ error: `User with name ${userName} not found` });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not get named user." });
    }
}

// ===================================
// POST a new User
// ===================================
export const postUser = async (req, res) => {
    try {
        /* Example POST
        {
            "name": "Brian",
            "email": "12345@gmail.com",
            "password": "12345",
            "roleName": "USER" // Name has to be exact match with existing role
        }*/
        const { name, email, password, roleName } = req.body;

        // Check for empty string
        const trimmedName = name ? name.trim() : null;
        const trimmedEmail = email ? email.trim() : null;

        if (!trimmedName || !trimmedEmail || !password) {
            return res.status(400).json({ error: "Name, email, and password are required fields." });
        }

        // Email format check
        if (!trimmedEmail.includes('@')) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        // Unique email for each user
        const existingUser = await prisma.user.findUnique({ where: { email: trimmedEmail } });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists with this email." });
        }

        // Find role by name, 
        const role = await prisma.role.findFirst({ 
            where: { 
                name: {
                    equals: roleName,
                    mode: 'insensitive' // Makes the check case-insensitive
                }
            }
        });
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }

        // Password hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        // ----------------------------------------------

        const user = await prisma.user.create({
            data: { 
                name, 
                email, 
                passwordHash: hashedPassword, 
                roleID: role.id 
            },
        });
        res.status(201).json(user)
    } catch (error) {
        console.error(error);

        // P2002 is the standard Prisma error code for unique constraint violation
        if (error.code === 'P2002') {
            return res.status(409).json({ error: `Type '${req.body.name}' already exists (database conflict).` });
        }

        res.status(500).json({ error: "Could not create user." });
    }
}