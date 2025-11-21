import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || undefined,
    entities: [__dirname + "/entities/*.{ts,js}"],
    migrations: [__dirname + "/migrations/*.{ts,js}"],
    synchronize: true, // create tables in db 
    logging: true,
});