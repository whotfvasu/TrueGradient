import { Router } from "express";
import { signup, signin, getProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile", authMiddleware, getProfile);

export default router;
