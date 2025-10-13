import express from "express";
import { getUserByName, getUsers, postUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/userByName", getUserByName);
router.post("/user", postUser);


export default router;