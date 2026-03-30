import { NextFunction, Request, Response } from "express";

export default class ErrorMiddleware {
    static errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
        console.error(`Time: ${new Date().toISOString()}`);
        console.error(`Path: ${req.originalUrl} | Method: ${req.method}`);
        console.error(`User: ${req.headers['x-user-id'] || 'N/A'}`);
        console.error(`Message: ${err.message}`);
        if (err.stack) console.error(`Stack trace: ${err.stack}`);
        
        const statusCode = err.status || 500;

        let userMessage = "Error occurred in server. Contact support for help.";
        
        if (statusCode === 404) userMessage = "The requested resource was not found.";
        if (statusCode === 401) userMessage = "You are not authorized to perform this action.";
        if (statusCode === 400) userMessage = "The request data is invalid.";

        res.status(statusCode).json({
            status: "error",
            message: err.message || "Internal Server Error",
            details: userMessage
        });
    }
}