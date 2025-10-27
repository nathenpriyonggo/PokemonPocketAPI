import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ===================================
// GET all Statuses
// ===================================
export const getStatuses = async (req, res) => {
    try {
        const statuses = await prisma.status.findMany({
            select: { 
                id: true,
                name: true
            }
        });
        res.status(200).json(statuses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not get status." });
    }
}

// ===================================
// POST a new Status
// ===================================
export const postStatus = async (req, res) => {
    try {
        const { name } = req.body;
        const statusName = name ? name.trim() : null;

        // Check for empty string
        if (!statusName) {
            return res.status(400).json({ error: "Status name is required." });
        }

        // Check if status already exists
        const existingStatus = await prisma.status.findFirst({ 
            where: { 
                name: {
                    equals: statusName,
                    mode: 'insensitive' // Makes the check case-insensitive
                }
            }
        });
        if (existingStatus) {
            return res.status(409).json({ error: "Status already exists." });
        }
        // ----------------------------------------------
        
        const status = await prisma.status.create({ 
            data: { 
                name: statusName 
            } 
        });
        res.status(201).json(status)
    } catch (error) {
        console.error(error);

        // P2002 is the standard Prisma error code for unique constraint violation
        if (error.code === 'P2002') {
            return res.status(409).json({ error: `Status '${req.body.name}' already exists (database conflict).` });
        }

        res.status(500).json({ error: "Could not create status." });
    }
}

