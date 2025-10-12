import { NextFunction, Request, Response } from "express";
import { extractTokenFromHeader, JWTPayload, verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Authentication required",
      message: error instanceof Error ? error.message : "Invalid token",
    });
  }
};
