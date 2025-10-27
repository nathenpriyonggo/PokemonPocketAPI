import express from "express";
import { getStatuses, postStatus } from "../controllers/statusController.js";

const router = express.Router();

router.get("/statuses", getStatuses);
router.post("/status", postStatus);


export default router;