import {Db,MongoClient} from "mongodb"

// **********להכניס ניתוב מונגו ושם למונגו פה מתחת**********
const DB_URL="mongodb+srv://tova:tova2026@cluster0.0gv4vnz.mongodb.net/?appName=Cluster0";
const DB_NAME="store";

export default class DbConn{
    private connection!:MongoClient;

    constructor(){}

    async init(){
        this.connection=await MongoClient.connect(DB_URL);
    }
    getStoreDb(){
        return this.connection.db(DB_NAME);
    }
    async terminate(){
        await this.connection.close();
    }
}