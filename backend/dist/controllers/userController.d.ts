import { Request, Response } from "express";
export declare const getUserStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserCredits: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addCredits: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserActivity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteUserAccount: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userController.d.ts.map