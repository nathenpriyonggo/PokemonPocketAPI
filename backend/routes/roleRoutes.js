import express from "express";
import { getRoles, postRole } from "../controllers/roleController.js";

const router = express.Router();

router.get("/roles", getRoles);
router.post("/role", postRole);


export default router;