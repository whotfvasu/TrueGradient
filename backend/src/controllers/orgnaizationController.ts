import { Request, Response } from "express";
import { OrganizationService } from "../services/orgnaization.service";

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: "Organization name is required",
      });
    }

    const organization = await OrganizationService.createOrganization({
      name: name.trim(),
      createdBy: userId,
    });
    
    res.status(201).json({
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    console.error("Create org error: ", error);
    res.status(500).json({
      error: "Failed to create organization",
      message: error instanceof Error ? error.message : "unknown error",
    });
  }
};

export const getUserOrganizations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }
    const organizations = await OrganizationService.getUserOrganizations(
      userId
    );
    res.json({
      organizations,
    });
  } catch (error) {
    console.error("Error geting user's organizations:", error);
    res.status(401).json({
      error: "Failed to get organizations",
      message: error instanceof Error ? error.message : "unkonwn error",
    });
  }
};

export const renameOrganization = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication Required",
      });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: "organization name is required",
      });
    }

    const organization = await OrganizationService.renameOrganization(
      id,
      userId,
      name.trim()
    );
  } catch (error) {
    console.error("Renaming Organization Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("Only admins")) {
      return res.status(403).json({
        error: "Permission denied",
        message: errorMessage,
      });
    }

    res.status(500).json({
      error: "Failed to rename organization",
      message: errorMessage,
    });
  }
};

export const getOrganizationMembers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const members = await OrganizationService.getOrganizationMembers(
      id,
      userId
    );

    res.json({
      members,
    });
  } catch (error) {
    console.error("Get members error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("Access denied")) {
      return res.status(403).json({
        error: "Access denied",
        message: errorMessage,
      });
    }

    res.status(500).json({
      error: "Failed to get members",
      message: errorMessage,
    });
  }
};

export const switchActiveOrganization = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const user = await OrganizationService.switchActiveOrganization(userId, id);

    res.json({
      message: "Switched organization successfully",
      activeOrganization: user.activeOrganization,
    });
  } catch (error) {
    console.error("Switch organization error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("not a member")) {
      return res.status(403).json({
        error: "Access denied",
        message: errorMessage,
      });
    }

    res.status(500).json({
      error: "Failed to switch organization",
      message: errorMessage,
    });
  }
};

export const sendInvitation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { email } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const invite = await OrganizationService.sendInvitation(
      id,
      userId,
      email.trim()
    );

    res.status(201).json({
      message: "Invitation sent successfully",
      invite: {
        id: invite.id,
        email: invite.email,
        token: invite.token,
        organization: invite.organization,
        expiresAt: invite.expiresAt,
      },
    });
  } catch (error) {
    console.error("Send invitation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("Only admins")) {
      return res.status(403).json({
        error: "Permission denied",
        message: errorMessage,
      });
    }

    if (errorMessage.includes("already")) {
      return res.status(409).json({
        error: "Conflict",
        message: errorMessage,
      });
    }

    res.status(500).json({
      error: "Failed to send invitation",
      message: errorMessage,
    });
  }
};

export const getPendingInvitations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const invites = await OrganizationService.getPendingInvitationsByUserId(
      userId
    );

    res.json({
      invitations: invites,
    });
  } catch (error) {
    console.error("Get pending invitations error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("User email not found")) {
      return res.status(400).json({
        error: "Bad Request",
        message: errorMessage,
      });
    }

    res.status(500).json({
      error: "Failed to get pending invitations",
      message: errorMessage,
    });
  }
};

export const getInvitationDetails = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const invite = await OrganizationService.getInvitationByToken(token);

    res.json({
      invitation: {
        email: invite.email,
        organization: invite.organization,
        inviter: invite.inviter,
        expiresAt: invite.expiresAt,
      },
    });
  } catch (error) {
    console.error("Get invitation details error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (
      errorMessage.includes("Invalid") ||
      errorMessage.includes("expired") ||
      errorMessage.includes("processed")
    ) {
      return res.status(400).json({
        error: "Invalid Invitation",
        message: errorMessage,
      });
    }

    res.status(500).json({
      error: "Failed to get invitation details",
      message: errorMessage,
    });
  }
};

export const acceptInvitation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { token } = req.params;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const organization = await OrganizationService.acceptInvitation(
      token,
      userId
    );

    res.json({
      message: "Invitation accepted successfully",
      organization,
    });
  } catch (error) {
    console.error("Accept invitation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (
      errorMessage.includes("Invalid") ||
      errorMessage.includes("expired") ||
      errorMessage.includes("processed")
    ) {
      return res.status(400).json({
        error: "Invalid Invitation",
        message: errorMessage,
      });
    }

    if (errorMessage.includes("different email")) {
      return res.status(403).json({
        error: "Permission denied",
        message: errorMessage,
      });
    }

    res.status(500).json({
      error: "Failed to accept invitation",
      message: errorMessage,
    });
  }
};

export const rejectInvitation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { token } = req.params;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const result = await OrganizationService.rejectInvitation(token, userId);

    res.json(result);
  } catch (error) {
    console.error("Reject invitation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (
      errorMessage.includes("Invalid") ||
      errorMessage.includes("processed")
    ) {
      return res.status(400).json({
        error: "Invalid Invitation",
        message: errorMessage,
      });
    }

    if (errorMessage.includes("different email")) {
      return res.status(403).json({
        error: "Permission denied",
        message: errorMessage,
      });
    }

    res.status(500).json({
      error: "Failed to reject invitation",
      message: errorMessage,
    });
  }
};
