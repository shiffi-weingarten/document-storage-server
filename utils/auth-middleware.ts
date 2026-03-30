import { Request, Response, NextFunction } from "express";
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).send("איפה ה id שלך?");
        
    }
    next();
}