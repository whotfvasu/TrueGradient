import { Router } from "express";
import {
  getUserStats,
  getUserCredits,
  addCredits,
  getUserProfile,
  updateUserProfile,
  getUserActivity,
  deleteUserAccount,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/stats", getUserStats);
router.get("/credits", getUserCredits);
router.post("/credits", addCredits);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

router.get("/activity", getUserActivity);

router.delete("/account", deleteUserAccount);

export default router;
