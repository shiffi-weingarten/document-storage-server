import { ObjectId } from "mongodb";

export interface IDocument{
    id:string;
    author:string; //user id
    path:string;
    title:string;
    content:string;
    createdAt:Date;
    lastUpdateAt:Date;
    lastUpdateBy:string; //user id

}

export interface IDocumentWithId extends IDocument {
    _id?: ObjectId;
}

export interface IDocument_details{
    id:string;
    author:string; //user id
    path:string;
    title:string;
}
export interface IDocumentDetailsWithId extends IDocument_details {
    _id?: ObjectId;
}