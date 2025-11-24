import { Router } from "express";
import { login, register, logout, me } from "@/controllers/authController";
import { authMiddleware } from "@/middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/me", authMiddleware, me);

export default router;
