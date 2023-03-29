// Libraries
import express, { json, Router } from "express";
import cors from "cors";
import { Sequelize } from "sequelize";

import type IApp from "./interfaces/IApp";

import UserModule from "../components/User/User.module";

export default class App implements IApp {
  private readonly _app: express.Application;
  private readonly router: Router;
  private readonly _db: Sequelize;

  constructor(dbConnection: Sequelize) {
    this._app = express();
    this.router = Router();
    this._db = dbConnection;
  }

  get app() {
    return this._app;
  }

  get db() {
    return this._db;
  }

  start(port: number) {
    if (port < 1) throw new Error("Invalid Port Number");

    new UserModule(this);

    this._app.use(cors());
    this._app.use(json());

    this._app.use(this.router);

    this._app.listen(port);
    console.log(`App is listening on port ${port}`);
  }

  route(path: string, router: Router) {
    this.router.use(path, router);
  }
}
