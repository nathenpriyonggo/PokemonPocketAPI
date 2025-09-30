import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const getRoles = async (req, res) => {
    try {
        const roles = await prisma.role.findMany({
            select: { name: true }
        });
        res.json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not get roles." });
    }
}


export const postRole = async (req, res) => {
    try {
        const { name } = req.body;
        const role = await prisma.role.create({ data: { name } });
        res.json(role)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not create role." });
    }
}

