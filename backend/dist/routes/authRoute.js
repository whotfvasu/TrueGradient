import { Router } from "express";
import { signup, signin, getProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile", authMiddleware, getProfile);
export default router;
//# sourceMappingURL=authRoute.js.map