import { Collection } from "mongodb";
import DbConn from "../utils/db-conn";
import { IHistoryEntry } from "./models";
const History_COLLECTION_NAME = "history";
export default class HistoryDal {
    private historyCollection: Collection<IHistoryEntry>

    constructor(dbconn: DbConn) {
        this.historyCollection = dbconn.getStoreDb().collection(History_COLLECTION_NAME);
    }
    async addHistory(historyEntry: IHistoryEntry): Promise<void> {
        await this.historyCollection.insertOne(historyEntry);
    }

    async getAllHistory(filter: any={}, page: number = 1, limit: number = 10): Promise<IHistoryEntry[]> {
        const skip = (page - 1) * limit;

        return await this.historyCollection
            .find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
    }
    async deleteAllHistory(): Promise<void> {
        await this.historyCollection.deleteMany({});
    }
}