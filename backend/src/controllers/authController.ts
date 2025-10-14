import { Request, Response } from "express";
import {
  AuthService,
  SignupData,
  SigninData,
} from "../services/authService";

export const signup = async (req: Request, res: Response) => {
  try {
    const signupData: SignupData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    const result = await AuthService.signup(signupData);

    res.status(201).json({
      message: "Account created successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("Signup error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Signup failed";

    // Handle specific validation errors
    if (errorMessage.includes("Validation failed")) {
      return res.status(400).json({
        error: "Validation Error",
        message: errorMessage.replace("Validation failed: ", ""),
      });
    }

    if (
      errorMessage.includes("already taken") ||
      errorMessage.includes("already registered")
    ) {
      return res.status(409).json({
        error: "Conflict",
        message: errorMessage,
      });
    }

    // Generic error response
    res.status(500).json({
      error: "Signup Failed",
      message: errorMessage,
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Missing credentials",
        message: "Username and password are required",
      });
    }

    const signinData: SigninData = { username, password };
    const result = await AuthService.signin(signinData);

    res.json({
      message: "Signed in successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("Signin error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Signin failed";

    // Handle authentication errors
    if (errorMessage.includes("Invalid username or password")) {
      return res.status(401).json({
        error: "Authentication Failed",
        message: "Invalid username or password",
      });
    }

    // Generic error response
    res.status(500).json({
      error: "Signin Failed",
      message: "An unexpected error occurred. Please try again.",
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
        message: "User ID not found in token",
      });
    }

    const user = await AuthService.getProfile(userId);

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to get profile";

    if (errorMessage.includes("User not found")) {
      return res.status(404).json({
        error: "User Not Found",
        message: errorMessage,
      });
    }

    res.status(500).json({
      error: "Profile Error",
      message: "Failed to retrieve user profile",
    });
  }
};
