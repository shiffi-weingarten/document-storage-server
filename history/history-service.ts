import HistoryDal from "./history-dal";
import { IHistoryEntry, OperationType } from    "./models";

export default class HistoryService {
    constructor(private historyDal: HistoryDal) {

    }
    async createHistory(user: string,
        documentId: string,
        documentPath: string,
        documentAuthor: string,
        operationType: OperationType): Promise<void> {
        const historyEntry: IHistoryEntry = {
            user: user,
            documentId: documentId,
            documentPath: documentPath,
            documentAuthor: documentAuthor,
            timestamp: new Date(),
            operationType: operationType
        };
        await this.historyDal.addHistory(historyEntry);
    }
    async getAllHistory(query: any = {}): Promise<IHistoryEntry[]> {
        const filter: any = {};
        if (query.pathPrefix) {
            filter.documentPath = { $regex: `^${query.pathPrefix}` };
        }
        const suppertedFields = ['user', 'documentId', 'documentAuthor', 'operationType'];
        suppertedFields.forEach(field => {
            if (query[field]) {
                filter[field] = query[field];
            }
        });
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        return this.historyDal.getAllHistory(filter, page, limit);
    }
    async deleteAllHistory(): Promise<void> {
        await this.historyDal.deleteAllHistory();
    }
}


