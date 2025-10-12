import { Request, Response } from "express";
import { UserService } from "../services/userService.js";

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
        message: "User ID not found in token",
      });
    }

    const stats = await UserService.getUserStats(userId);
    res.json(stats);
  } catch (error) {
    console.error("Get user stats error:", error);

    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({
        error: "User not found",
        message: error.message,
      });
    }

    res.status(500).json({
      error: "Failed to get user stats",
      message: "An unexpected error occurred",
    });
  }
};

export const getUserCredits = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      error: "Authentication required",
      message: "User ID not found in token",
    });
  }

  const credits = await UserService.getUserCredits(userId);
  res.json(credits);
};

export const addCredits = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { amount, reason } = req.body;

  if (!userId) {
    return res.status(401).json({
      error: "Authentication required",
      message: "User ID not found in token",
    });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({
      error: "Invalid input",
      message: "Amount must be a positive number",
    });
  }

  const user = await UserService.addCredits(userId, amount, reason);

  res.json({
    message: "Credits added successfully",
    user,
  });
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
        message: "User ID not found in token",
      });
    }

    const profile = await UserService.getUserProfile(userId);
    res.json({ user: profile });
  } catch (error) {
    console.error("Get user profile error:", error);

    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({
        error: "User not found",
        message: error.message,
      });
    }

    res.status(500).json({
      error: "Failed to get user profile",
      message: "An unexpected error occurred",
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { email } = req.body;

  if (!userId) {
    return res.status(401).json({
      error: "Authentication required",
      message: "User ID not found in token",
    });
  }

  const user = await UserService.updateUserProfile(userId, { email });

  res.json({
    message: "Profile updated successfully",
    user,
  });
};

export const getUserActivity = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!userId) {
    return res.status(401).json({
      error: "Authentication required",
      message: "User ID not found in token",
    });
  }

  const activity = await UserService.getUserActivity(userId, limit);
  res.json(activity);
};

export const deleteUserAccount = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      error: "Authentication required",
      message: "User ID not found in token",
    });
  }

  const result = await UserService.deleteUser(userId);
  res.json(result);
};
