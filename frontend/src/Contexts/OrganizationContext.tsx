import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";
import toast from "react-hot-toast";
import type { Organization, OrganizationInvite } from "../types/organization";

interface OrganizationContextType {
  organizations: Organization[];
  currentOrganization: Organization | null;
  pendingInvitations: OrganizationInvite[];
  isLoading: boolean;
  switchOrganization: (orgId: string) => Promise<void>;
  createOrganization: (name: string) => Promise<void>;
  renameOrganization: (orgId: string, name: string) => Promise<void>;
  inviteMember: (orgId: string, email: string) => Promise<void>;
  acceptInvitation: (token: string) => Promise<void>;
  rejectInvitation: (token: string) => Promise<void>;
  loadOrganizations: () => Promise<void>;
  loadPendingInvitations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, organization, updateOrganization } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(organization as Organization | null);
  const [pendingInvitations, setPendingInvitations] = useState<
    OrganizationInvite[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      loadOrganizations();
      loadPendingInvitations();
    }
  }, [token]);

  useEffect(() => {
    setCurrentOrganization(organization as Organization | null);
  }, [organization]);

  const loadOrganizations = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await api.getOrganizations(token);
      setOrganizations(response.organizations || []);
    } catch (error) {
      console.error("Failed to load organizations:", error);
      toast.error("Failed to load organizations");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingInvitations = async () => {
    if (!token) return;

    try {
      const response = await api.getPendingInvitations(token);
      setPendingInvitations(response.invitations || []);
    } catch (error) {
      console.error("Failed to load invitations:", error);
    }
  };

  const switchOrganization = async (orgId: string) => {
    if (!token) return;

    try {
      const response = await api.switchOrganization(token, orgId);
      const newOrg = response.activeOrganization;

      setCurrentOrganization(newOrg);
      updateOrganization(newOrg);
      toast.success(`Switched to ${newOrg.name}`);

      // Reload conversations for new organization
      window.location.reload();
    } catch (error) {
      console.error("Failed to switch organization:", error);
      toast.error("Failed to switch organization");
    }
  };

  const createOrganization = async (name: string) => {
    if (!token) return;

    try {
      await api.createOrganization(token, name);
      await loadOrganizations();
      toast.success("Organization created successfully");
    } catch (error) {
      console.error("Failed to create organization:", error);
      toast.error("Failed to create organization");
      throw error;
    }
  };

  const renameOrganization = async (orgId: string, name: string) => {
    if (!token) return;

    try {
      await api.renameOrganization(token, orgId, name);
      await loadOrganizations();

      if (currentOrganization?.id === orgId) {
        const updated = {
          ...currentOrganization,
          name,
          createdBy: (organization as any)?.createdBy ?? "",
        };
        setCurrentOrganization(updated);
        updateOrganization(updated as any);
      }

      toast.success("Organization renamed successfully");
    } catch (error) {
      console.error("Failed to rename organization:", error);
      toast.error("Failed to rename organization");
      throw error;
    }
  };

  const inviteMember = async (orgId: string, email: string) => {
    if (!token) return;

    try {
      await api.inviteMember(token, orgId, email);
      toast.success(`Invitation sent to ${email}`);
    } catch (error) {
      console.error("Failed to send invitation:", error);
      toast.error("Failed to send invitation");
      throw error;
    }
  };

  const acceptInvitation = async (inviteToken: string) => {
    if (!token) return;

    try {
      const response = await api.acceptInvitation(token, inviteToken);
      await loadOrganizations();
      await loadPendingInvitations();
      toast.success(`Joined ${response.organization.name}`);
    } catch (error) {
      console.error("Failed to accept invitation:", error);
      toast.error("Failed to accept invitation");
      throw error;
    }
  };

  const rejectInvitation = async (inviteToken: string) => {
    if (!token) return;

    try {
      await api.rejectInvitation(token, inviteToken);
      await loadPendingInvitations();
      toast.success("Invitation rejected");
    } catch (error) {
      console.error("Failed to reject invitation:", error);
      toast.error("Failed to reject invitation");
      throw error;
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrganization,
        pendingInvitations,
        isLoading,
        switchOrganization,
        createOrganization,
        renameOrganization,
        inviteMember,
        acceptInvitation,
        rejectInvitation,
        loadOrganizations,
        loadPendingInvitations,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }
  return context;
};
