import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (
  payload: Omit<JWTPayload, "iat" | "exp">
): string => {
  return jwt.sign(
    payload as string | object | Buffer,
    JWT_SECRET as jwt.Secret,
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const extractTokenFromHeader = (
  authHeader: string | undefined
): string => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No valid authorization header found");
  }
  return authHeader.substring(7); // bearer removed
};
