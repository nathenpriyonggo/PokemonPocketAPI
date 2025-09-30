import express from "express";
import { signup, signin, logout, getMe } from "../controllers/authController.js";

import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

// Protected route
router.get("/me", authMiddleware, getMe);

export default router;
