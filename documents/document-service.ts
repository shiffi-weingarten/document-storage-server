import HistoryService from "../history/history-service";
import DocumentDal from "./document-dal";
import { IDocument_details } from "./models";
import { IDocument } from "./models";
import { OperationType } from "../history/models";
import { ObjectId } from "mongodb";




export default class DocumentService {
    constructor(private documentDal: DocumentDal, private historyService: HistoryService) { }

    async createDocument(document: IDocument, document_details: IDocument_details): Promise<void> {
        document.id = new ObjectId().toHexString();
        document_details.id = document.id;
        const myDate = new Date();
        document.createdAt = myDate;
        document.lastUpdateAt = myDate;
        document.lastUpdateBy = document.author;
        await this.documentDal.createDocument(document, document_details);
        await this.historyService.createHistory(document.author, document.id, document.path, document.author, OperationType.CREATE);
    }

    async getAllDocumentsDetails(sortBy?: string, pathPrefix?: string, author?: string): Promise<IDocument_details[]> {
        const filter: any = {};
        const sortOptions: any = {};
        if (pathPrefix) {
            filter.path = { $regex: `^${pathPrefix}` };
        }
        if (author) {
            filter.author = author;
        }
        if (sortBy) {
            const isDescending = sortBy.startsWith("-");
            const field = isDescending ? sortBy.substring(1) : sortBy;
            sortOptions[field] = isDescending ? -1 : 1;

        }
        return this.documentDal.getAllDocumebsDetails(sortOptions, filter);
       

    }

    async getDocumentDetailsById(id: string): Promise<IDocument_details> {
        return this.documentDal.getDocumentDetailsById(id);
      
    }

    async updateDocument(document: IDocument, userId: string): Promise<IDocument_details> {
        document.lastUpdateAt = new Date();
        document.lastUpdateBy = userId;
        await this.historyService.createHistory(userId, document.id, document.path, document.author, OperationType.UPDATE);
        return await this.documentDal.updateDocument(document);

    }
    async deleteDocument(id: string,userId:string): Promise<IDocument_details> {
        const deleted = await this.documentDal.deleteDocument(id);
        await this.historyService.createHistory(userId, deleted.id, deleted.path, deleted.author, OperationType.DELETE);
        return deleted;

    }
    async createPDF(id: string) {
    const PDFDocument = require('pdfkit');
    const fs = require('fs');
    const document = await this.documentDal.getDocumentById(id);
    if (!document) throw new Error("Document not found");

    const filePath = `./${id}.pdf`;
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    return new Promise<{ filePath: string, fileName: string }>((resolve, reject) => {
        stream.on('finish', () => {
            resolve({ filePath, fileName: `${document.title}.pdf` });
        });
        stream.on('error', reject);

        doc.pipe(stream);
        doc.fontSize(25).text(document.title, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(document.content, { align: 'right' });
        doc.end();
    });
}

}