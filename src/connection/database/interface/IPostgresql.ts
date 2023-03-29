import { Sequelize } from "sequelize";

export default interface IMongodb {
    connect: (
      username: string,
      password: string,
      host: string,
      database: string,
      port: number
    ) => Promise<{
        result: boolean,
        connection?: Sequelize
    }>;
  }
  