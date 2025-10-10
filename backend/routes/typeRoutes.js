import express from "express";
import { getTypes, postType } from "../controllers/typeController.js";

const router = express.Router();

router.get("/types", getTypes);
router.post("/type", postType);


export default router;