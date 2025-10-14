import { NextFunction, Request, Response } from "express";
import { JWTPayload } from "../utils/jwt";
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authMiddleware.d.ts.map