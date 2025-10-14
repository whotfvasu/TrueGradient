const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

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
