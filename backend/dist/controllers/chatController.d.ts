import { Request, Response } from "express";
export declare const createConversation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getConversations: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getConversation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const sendMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteConversation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateConversation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=chatController.d.ts.map