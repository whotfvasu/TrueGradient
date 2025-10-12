import { Request, Response } from "express";
import {
  AuthService,
  SignupData,
  SigninData,
} from "../services/authService.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const signupData: SignupData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    const result = await AuthService.signup(signupData);

    res.status(201).json({
      message: "account created successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("signup error:", error);
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
      message: "signed in successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error("signin error:", error);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "authentication required",
        message: "user Id not found in token",
      });
    }

    const user = await AuthService.getProfile(userId);

    res.json({ user });
  } catch (error) {
    console.error("get profile error:", error);
  }
};
