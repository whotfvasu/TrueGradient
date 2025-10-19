const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const api = {
  async signin(username: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signin failed");
    }

    return response.json();
  },

  async signup(username: string, password: string, email?: string) {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to get profile");
    return response.json();
  },
  
  async getOrganizations(token: string) {
    const response = await fetch(`${API_BASE}/organizations`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to get organizations");
    return response.json();
  },

  async createOrganization(token: string, name: string) {
    const response = await fetch(`${API_BASE}/organizations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error("Failed to create organization");
    return response.json();
  },

  async renameOrganization(token: string, orgId: string, name: string) {
    const response = await fetch(`${API_BASE}/organizations/${orgId}/rename`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error("Failed to rename organization");
    return response.json();
  },

  async switchOrganization(token: string, orgId: string) {
    const response = await fetch(`${API_BASE}/organizations/${orgId}/switch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to switch organization");
    return response.json();
  },

  async getOrganizationMembers(token: string, orgId: string) {
    const response = await fetch(`${API_BASE}/organizations/${orgId}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to get members");
    return response.json();
  },

  async inviteMember(token: string, orgId: string, email: string) {
    const response = await fetch(`${API_BASE}/organizations/${orgId}/invite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error("Failed to send invitation");
    return response.json();
  },

  async getPendingInvitations(token: string) {
    const response = await fetch(
      `${API_BASE}/organizations/invitations/pending`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Failed to get invitations");
    return response.json();
  },

  async acceptInvitation(token: string, inviteToken: string) {
    const response = await fetch(
      `${API_BASE}/organizations/invitations/${inviteToken}/accept`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to accept invitation");
    return response.json();
  },

  async rejectInvitation(token: string, inviteToken: string) {
    const response = await fetch(
      `${API_BASE}/organizations/invitations/${inviteToken}/reject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to reject invitation");
    return response.json();
  },

  async getConversations(token: string) {
    const response = await fetch(`${API_BASE}/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to get conversations");
    return response.json();
  },

  async createConversation(token: string, title?: string) {
    const response = await fetch(`${API_BASE}/chat/conversations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) throw new Error("Failed to create conversation");
    return response.json();
  },

  async sendMessage(token: string, conversationId: string, content: string) {
    const response = await fetch(
      `${API_BASE}/chat/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) throw new Error("Failed to send message");
    return response.json();
  },

  async getConversation(token: string, conversationId: string) {
    const response = await fetch(
      `${API_BASE}/chat/conversations/${conversationId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Failed to get conversation");
    return response.json();
  },

  async getUserCredits(token: string) {
    const response = await fetch(`${API_BASE}/users/credits`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to get credits");
    return response.json();
  },
};
