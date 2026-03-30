import { NextFunction, Router } from "express";
import HistoryService from "./history-service";
import { authMiddleware } from "../utils/auth-middleware";

export default class HistoryApi {
    public router!: Router;
    constructor(private historyService: HistoryService) { }


    init() {
        this.router = Router();
        this.setRoutes();
    }

    setRoutes() {
        this.router.use(authMiddleware);
        this.router.get("/", this.getAllHistory.bind(this));
        this.router.delete("/", this.deleteAllHistory.bind(this));

    }
    async getAllHistory(req: any, res: any, next: NextFunction) {
        try {
            const query = req.query;
            const result = await this.historyService.getAllHistory(query);
            res.status(200).send(result);
        } catch (error) {
            next(error);
        }

    }
    async deleteAllHistory(req: any, res: any, next: NextFunction) {
        try {
            await this.historyService.deleteAllHistory();
            res.status(200).send();
        } catch (error) {
            next(error);
        }

    }

}