import { Sequelize } from "sequelize";

import type IPostgresql from "./interface/IPostgresql";
import User from "../../models/User";

export default class Postgresql implements IPostgresql {
    async connect (
        username: string, 
        password: string, 
        host: string, 
        database: string,
        port: number, 
        ): Promise<{
            result: boolean,
            connection?: Sequelize
        }> {
            try {
                const sequelize = new Sequelize(database, username, password, {
                    host,
                    port,
                    dialect: "postgres",
                });
                
                User(sequelize);
                
                return {
                    result: true,
                    connection: sequelize
                };
            } catch (e) {
                console.log(e)
                return {
                    result: false,
                }
            }
    };
}