import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ===================================
// GET all Roles
// ===================================
export const getRoles = async (req, res) => {
    try {
        const roles = await prisma.role.findMany({
            select: { 
                id: true,
                name: true
            }
        });
        res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not get roles." });
    }
}

// ===================================
// POST a new Role
// ===================================
export const postRole = async (req, res) => {
    try {
        const { name } = req.body;
        const roleName = name ? name.trim() : null;

        // Check for empty string
        if (!roleName) {
            return res.status(400).json({ error: "Role name is required." });
        }

        // Check if role already exists
        const existingRole = await prisma.role.findFirst({ 
            where: { 
                name: {
                    equals: roleName,
                    mode: 'insensitive' // Makes the check case-insensitive
                }
            }
        });
        if (existingRole) {
            return res.status(409).json({ error: "Role already exists." });
        }
        // ----------------------------------------------

        const role = await prisma.role.create({ 
            data: { 
                name: roleName 
            } 
        });
        res.status(201).json(role)
    } catch (error) {
        console.error(error);

        // P2002 is the standard Prisma error code for unique constraint violation
        if (error.code === 'P2002') {
            return res.status(409).json({ error: `Role '${req.body.name}' already exists (database conflict).` });
        }

        res.status(500).json({ error: "Could not create role." });
    }
}

