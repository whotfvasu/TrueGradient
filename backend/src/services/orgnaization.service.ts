import { prisma } from "../lib/prisma";
import { randomBytes } from "crypto";

export interface CreateOrganizationData {
  name: string;
  createdBy: string;
}

export class OrganizationService {
  static async createOrganization(data: CreateOrganizationData) {
    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        createdBy: data.createdBy,
        members: {
          create: {
            userId: data.createdBy,
            role: "admin",
            status: "active",
          },
        },
      },
      include: {
        members: true,
      },
    });
    return organization;
  }

  static async getUserOrganizations(userId: string) {
    const memberships = await prisma.organizationMember.findMany({
      where: {
        userId,
        status: "active",
      },
      include: {
        organization: {
          include: {
            _count: {
              select: { members: true },
            },
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    return memberships.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      role: m.role,
      memberCount: m.organization._count.members,
      joinedAt: m.joinedAt,
      createdAt: m.organization.createdAt,
    }));
  }

  static async renameOrganization(
    organizationId: string,
    userId: string,
    newName: string
  ) {
    const member = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
        role: "admin",
      },
    });

    if (!member) {
      throw new Error("Only admins can rename organizations");
    }
    const organization = await prisma.organization.update({
      where: { id: organizationId },
      data: { name: newName },
    });
    return organization;
  }

  static async switchActiveOrganization(
    userId: string,
    organizationId: string
  ) {
    const member = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
        status: "active",
      },
    });
    if (!member) {
      throw new Error("You are not a member of this organization");
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: { activeOrganizationId: organizationId },
      include: {
        activeOrganization: true,
      },
    });
    return user;
  }

  static async getOrganizationMembers(organizationId: string, userId: string) {
    const member = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
      },
    });
    if (!member) {
      throw new Error("access denied");
    }

    const members = await prisma.organizationMember.findMany({
      where: {
        organizationId,
        status: "active",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    });
    return members;
  }

  static async sendInvitation(
    organizationId: string,
    inviterId: string,
    email: string
  ) {
    const inviter = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: inviterId,
        role: "admin",
      },
    });
    if (!inviter) {
      throw new Error("Only admins can send invitations");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      const existingMember = await prisma.organizationMember.findFirst({
        where: {
          organizationId,
          userId: existingUser.id,
        },
      });
      if (existingMember) {
        throw new Error("User is already a member of this organization");
      }
    }
    const existingInvite = await prisma.organizationInvite.findFirst({
      where: {
        organizationId,
        email,
        status: "pending",
      },
    });
    if (existingInvite) {
      throw new Error("Invitation already sent to this email");
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const invite = await prisma.organizationInvite.create({
      data: {
        organizationId,
        inviterId,
        email,
        token: randomBytes(32).toString("hex"),
        expiresAt,
      },
      include: {
        organization: true,
        inviter: {
          select: {
            username: true,
          },
        },
      },
    });

    return invite;
  }

  static async acceptInvitation(token: string, userId: string) {
    const invite = await prisma.organizationInvite.findUnique({
      where: { token },
      include: {
        organization: true,
      },
    });

    if (!invite) {
      throw new Error("Invalid invitation");
    }

    if (invite.status !== "pending") {
      throw new Error("Invitation has already been processed");
    }

    if (new Date() > invite.expiresAt) {
      await prisma.organizationInvite.update({
        where: { id: invite.id },
        data: { status: "expired" },
      });
      throw new Error("Invitation has expired");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (user?.email !== invite.email) {
      throw new Error("This invitation is for a different email address");
    }

    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: invite.organizationId,
        userId,
      },
    });

    if (existingMember) {
      await prisma.organizationInvite.update({
        where: { id: invite.id },
        data: { status: "accepted" },
      });
      return invite.organization;
    }

    await prisma.$transaction([
      prisma.organizationMember.create({
        data: {
          organizationId: invite.organizationId,
          userId,
          role: "member",
          status: "active",
        },
      }),
      prisma.organizationInvite.update({
        where: { id: invite.id },
        data: { status: "accepted" },
      }),
    ]);

    return invite.organization;
  }

  static async rejectInvitation(token: string, userId: string) {
    const invite = await prisma.organizationInvite.findUnique({
      where: { token },
    });

    if (!invite) {
      throw new Error("Invalid invitation");
    }

    if (invite.status !== "pending") {
      throw new Error("Invitation has already been processed");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (user?.email !== invite.email) {
      throw new Error("This invitation is for a different email address");
    }

    await prisma.organizationInvite.update({
      where: { id: invite.id },
      data: { status: "rejected" },
    });

    return { message: "Invitation rejected" };
  }

  static async getPendingInvitationsByUserId(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user?.email) {
      throw new Error("User email not found");
    }
    const invites = await prisma.organizationInvite.findMany({
      where: {
        email: user.email,
        status: "pending",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        organization: true,
        inviter: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return invites;
  }
  
  static async getPendingInvitations(email: string) {
    const invites = await prisma.organizationInvite.findMany({
      where: {
        email,
        status: "pending",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        organization: true,
        inviter: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return invites;
  }

  static async getInvitationByToken(token: string) {
    const invite = await prisma.organizationInvite.findUnique({
      where: { token },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        inviter: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!invite) {
      throw new Error("Invalid invitation");
    }

    if (invite.status !== "pending") {
      throw new Error("Invitation has already been processed");
    }

    if (new Date() > invite.expiresAt) {
      await prisma.organizationInvite.update({
        where: { id: invite.id },
        data: { status: "expired" },
      });
      throw new Error("Invitation has expired");
    }

    return invite;
  }
}
