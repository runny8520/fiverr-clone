import express from "express";
import { verifyAdmin, verifyToken } from "../middelware/jwt.js";
import { getAdminStats, getAdminUsers } from "../controller/admin.controller.js";

const router = express.Router();

router.get("/stats", verifyToken, verifyAdmin, getAdminStats);
router.get("/users", verifyToken, verifyAdmin, getAdminUsers);

export default router;
