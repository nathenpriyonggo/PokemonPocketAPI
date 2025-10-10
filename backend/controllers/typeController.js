import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ===================================
// GET all Types
// ===================================
export const getTypes = async (req, res) => {
    try {
        const types = await prisma.type.findMany({
            select: { 
                id: true,
                name: true
            }
        });
        res.status(200).json(types);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not get types." });
    }
}

// ===================================
// POST a new Type
// ===================================
export const postType = async (req, res) => {
    try {
        const { name } = req.body;
        const typeName = name ? name.trim() : null;

        // Check for empty string
        if (!typeName) {
            return res.status(400).json({ error: "Type name is required." });
        }

        // Check if type already exists
        const existingType = await prisma.type.findFirst({ 
            where: { 
                name: {
                    equals: typeName,
                    mode: 'insensitive' // Makes the check case-insensitive
                }
            }
        });
        if (existingType) {
            return res.status(409).json({ error: "Type already exists." });
        }
        // ----------------------------------------------
        
        const type = await prisma.type.create({ 
            data: { 
                name: typeName 
            } 
        });
        res.status(201).json(type)
    } catch (error) {
        console.error(error);

        // P2002 is the standard Prisma error code for unique constraint violation
        if (error.code === 'P2002') {
            return res.status(409).json({ error: `Type '${req.body.name}' already exists (database conflict).` });
        }

        res.status(500).json({ error: "Could not create type." });
    }
}

