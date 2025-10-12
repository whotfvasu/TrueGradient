export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    credits: number;
  };
}

export const AuthService = {
  async signIn(data: SignInRequest): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return response.json();

    // For now, simulate success for frontend development
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      token: "temp-token",
      user: { id: "1", username: data.username, credits: 1250 },
    };
  },

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return response.json();

    // For now, simulate success for frontend development
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      token: "temp-token",
      user: { id: "1", username: data.username, credits: 1250 },
    };
  },
};
