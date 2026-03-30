import { error } from "node:console";
import DocumentDal from "./documents/document-dal";
import DocumentService from "./documents/document-service";
import DocumentApi from "./documents/documents-api";
import historyApi from "./history/history-api";
import HistoryApi from "./history/history-api";
import HistoryDal from "./history/history-dal";
import HistoryService from "./history/history-service";
import DbConn from "./utils/db-conn";
import express, { Express } from "express";
import ErrorMiddleware from "./utils/error-middleware";




const HOST = "127.0.0.1";
const PORT = 5000;

export default class App {
    private app: Express;
    private dbConn!: DbConn;
    constructor() {
        this.app = express();
    }
    async init() {
        this.dbConn = new DbConn();
        await this.dbConn.init();

        const historyDal = new HistoryDal(this.dbConn);
        const historyService = new HistoryService(historyDal);
        const documentDal = new DocumentDal(this.dbConn);
        const documentService = new DocumentService(documentDal, historyService);
        const documentApi = new DocumentApi(documentService);
        documentApi.init();
        const historyApi = new HistoryApi(historyService);
        historyApi.init();

        this.setRoutes(documentApi, historyApi);
    }
    private setRoutes(documentApi: DocumentApi, historyApi: HistoryApi) {
        this.app.use(express.json());
        this.app.use("/documents", documentApi.router);
        this.app.use("/history", historyApi.router);
        this.app.use(ErrorMiddleware.errorHandler);
        


        this.app.listen(PORT, HOST, () => {
            console.log(`Listening on: http://${HOST}:${PORT}`);
        })
    }

    async terminate(){
        if(this.dbConn){
            await this.dbConn.terminate();
        }
    }
}