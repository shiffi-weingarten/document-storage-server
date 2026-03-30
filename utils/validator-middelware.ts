import { Request, Response, NextFunction } from "express";

export default class DocumentValidator {
    static validateCreate(req: Request, res: Response, next: NextFunction) {
        const { title, content, path } = req.body;

        if (!title || !content || !path) {
            const error: any = new Error("Missing required fields: title, content, and path are mandatory.");
            error.status = 400; 
            return next(error);
        }
        next();
    }
}