import { ObjectId } from "bson";

export enum OperationType{
    CREATE="CREATE",
    UPDATE="UPDATE",
    DELETE="DELETE"
}

export interface IHistoryEntry{
    user: string;
    documentId:string;
    documentPath:string;
    documentAuthor:string;
    timestamp:Date;
    operationType:OperationType;
}
export interface IHistoryWithId extends History {
    _id?: ObjectId;
}

