import { extractTokenFromHeader, verifyToken } from "../utils/jwt";
export const authMiddleware = async (req, res, next) => {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);
        const payload = verifyToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).json({
            error: "Authentication required",
            message: error instanceof Error ? error.message : "Invalid token",
        });
    }
};
//# sourceMappingURL=authMiddleware.js.map