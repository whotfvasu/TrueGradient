import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error("Invalid or expired token");
    }
};
export const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No valid authorization header found");
    }
    return authHeader.substring(7); // bearer removed
};
//# sourceMappingURL=jwt.js.map