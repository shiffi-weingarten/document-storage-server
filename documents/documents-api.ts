import { NextFunction, Router, Request, Response } from "express";
import DocumentService from "./document-service";
import { IDocument } from "./models"
import { IDocument_details } from "./models";
import { authMiddleware } from "../utils/auth-middleware";
import DocumentValidator from "../utils/validator-middelware";

export default class DocumentApi {
    public router!: Router;
    constructor(private documentService: DocumentService) { }


    init() {
        this.router = Router();
        this.setRoutes();
    }
    setRoutes() {
        this.router.use(authMiddleware);
        this.router.post("/",DocumentValidator.validateCreate, this.createDocument.bind(this));
        this.router.get("/", this.getAllDocumentsDetails.bind(this));
        this.router.get("/:id", this.getDocumentDetailsById.bind(this));
        this.router.put("/", this.updateDocument.bind(this));
        this.router.delete("/:id", this.deleteDocument.bind(this));
        this.router.post("/:id/create-pdf", this.createPDF.bind(this));
    }
    private async createDocument(req: Request, res: Response, next: NextFunction) {
        try {
            const document = req.body as IDocument;
            const documentDetails = req.body as IDocument_details;
            const userId = req.headers['x-user-id'] as string;
            documentDetails.author = userId;
            document.author = userId;
            const result = await this.documentService.createDocument(document, documentDetails);
            res.status(201).send(documentDetails);

        } catch (error) {
            next(error);
        }

    }
    private async getAllDocumentsDetails(req: Request, res: Response, next: NextFunction) {
        try {

            const sortBy = req.query.sortBy as string | undefined;
            const pathPrefix = req.query.pathPrefix as string | undefined;
            const author = req.query.author as string | undefined;
            const result = await this.documentService.getAllDocumentsDetails(sortBy, pathPrefix, author);
            res.status(200).send(result);

        } catch (error) {
            next(error);
        }
    }
    private async getDocumentDetailsById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const result = await this.documentService.getDocumentDetailsById(id);
            res.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }
    private async updateDocument(req: Request, res: Response, next: NextFunction) {
        try {
            const document = req.body as IDocument;
            const userId = req.headers['x-user-id'] as string;
            const result = await this.documentService.updateDocument(document, userId);
            res.status(200).send(result);
        }
        catch (error) {
            next(error);
        }
    }
    private async deleteDocument(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const userId = req.headers['x-user-id'] as string;
            const result = await this.documentService.deleteDocument(id, userId);
            res.status(200).send(result);
        } catch (error) {
            next(error);
        }

    }
    private async createPDF(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const { filePath, fileName } = await this.documentService.createPDF(id);
            res.download(filePath, fileName, (err) => {
                if (err) {
                    next(err);
                }
                const fs = require('fs');
                fs.unlinkSync(filePath)
            });
        } catch (error) {
            next(error);
        }

    }


}




