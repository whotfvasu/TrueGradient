import { Router } from "express";
import {
  acceptInvitation,
  createOrganization,
  getInvitationDetails,
  getOrganizationMembers,
  getPendingInvitations,
  getUserOrganizations,
  rejectInvitation,
  renameOrganization,
  sendInvitation,
  switchActiveOrganization,
} from "../controllers/orgnaizationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createOrganization);
router.get("/", getUserOrganizations);
router.patch("/:id/rename", renameOrganization);
router.post("/:id/switch", switchActiveOrganization);

router.get("/:id/members", getOrganizationMembers);

router.post("/:id/invite", sendInvitation);
router.get("/invitations/pending", getPendingInvitations);
router.get("/invitations/:token", getInvitationDetails);
router.post("/invitations/:token/accept", acceptInvitation);
router.post("/invitations/:token/reject", rejectInvitation);

export default router;
