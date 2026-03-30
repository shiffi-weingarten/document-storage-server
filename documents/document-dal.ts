import { Collection } from "mongodb"
import DbConn from "../utils/db-conn"
import { IDocument, IDocumentWithId, IDocument_details, IDocumentDetailsWithId } from "./models"
import { OperationType } from "../history/models";
// **********להכניס שם לקולקשן פה מתחת**********

const DOCUMENT_COLLECTION_NAME = "documents";
const DOCUMENT_DETAILS_COLLECTION_NAME = "document_details";
export default class DocumentDal {
    private documentCollection: Collection<IDocument>
    private documentDetailsCollection: Collection<IDocument_details>
    constructor(dbconn: DbConn) {
        this.documentCollection = dbconn.getStoreDb().collection(DOCUMENT_COLLECTION_NAME);
        this.documentDetailsCollection = dbconn.getStoreDb().collection(DOCUMENT_DETAILS_COLLECTION_NAME);
    }

    async createDocument(document: IDocument, document_details: IDocument_details): Promise<void> {
        await this.documentCollection.insertOne(document);
        await this.documentDetailsCollection.insertOne(document_details);
    }

    async getAllDocumebsDetails(sortBy: any = {}, pathPrefix: any = {}): Promise<IDocument_details[]> {
        const documentDetails: Array<IDocument_details> = await this.documentDetailsCollection
            .find(pathPrefix)
            .sort(sortBy)
            .toArray();
        return documentDetails;
    }

    //הפונקציה  הזו מקבלת id ומחזירה את כל פרטי המסמך ולא מסמך שלם
    

    //שיניתי שהיא מחזירה פרטי מסמך ולא מסמך שלם
    async getDocumentDetailsById(id: string): Promise<IDocument_details> {
        const documentDetails: IDocumentDetailsWithId | null = await this.documentDetailsCollection.findOne({ id });
        if (!documentDetails) {
            throw new Error("DOCUMENT_NOT_FOUND_ERROR");
        }
        delete documentDetails._id;
        return documentDetails;
    }

    //שיניתי שהיא מוצאת מסמך אחד ומעדכנת אותו כדי שזה יע=חזיר לי תוצאה ואז אני אוכל ליצור משתנה מסוג פרטי מסמך ולהחזיר אותו ובסרויס עדכנתי את השדה עדכון אחרון ב - ע"י - משתמש כל שהוא
    async updateDocument(document: IDocumentWithId): Promise<IDocument_details> {
        delete document._id;
        const updateDocument = await this.documentCollection.findOneAndUpdate({ id: document.id }, { $set: document }, { returnDocument: 'after' });
        if (!updateDocument) {
            throw new Error("המסמך לא נמצא ולא עודכן");
        }
        const documentDetails: IDocument_details = {
            id: updateDocument.id,
            author: updateDocument.author,
            path: updateDocument.path,
            title: updateDocument.title
        };
        await this.documentDetailsCollection.updateOne({ id: document.id }, { $set: documentDetails });//להדגיש על השורה הזו לשיפי!!!! ויש עליה גם בפונקציה הבאה
        return documentDetails;

    }

    async deleteDocument(id: string): Promise<IDocument_details> {
        
        const deletedDocument= await this.documentCollection.findOneAndDelete({ id });
        if (!deletedDocument) {
            throw new Error("DOCUMENT_NOT_FOUND_ERROR");
        }
        const deletedDocumentDetails: IDocument_details = {
            id:deletedDocument.id,
            author: deletedDocument.author,
            path: deletedDocument.path,
            title: deletedDocument.title
        }
        await this.documentDetailsCollection.deleteOne({ id: deletedDocumentDetails.id });
        return deletedDocumentDetails;

    }
    async getDocumentById(id:string):Promise<IDocument>{
       const document=await this.documentCollection.findOne({id});
       if (!document) {
            throw new Error("DOCUMENT_NOT_FOUND_ERROR");
        }
       return document;
    }

}
