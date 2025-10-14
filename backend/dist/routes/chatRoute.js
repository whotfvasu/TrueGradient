import { Router } from "express";
import { createConversation, getConversations, getConversation, sendMessage, deleteConversation, updateConversation, } from "../controllers/chatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();
router.use(authMiddleware);
router.post("/conversations", createConversation);
router.get("/conversations", getConversations);
router.get("/conversations/:conversationId", getConversation);
router.put("/conversations/:conversationId", updateConversation);
router.delete("/conversations/:conversationId", deleteConversation);
router.post("/conversations/:conversationId/messages", sendMessage);
export default router;
//# sourceMappingURL=chatRoute.js.map