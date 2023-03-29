import type { Application, Router } from "express";
import { Sequelize } from "sequelize";

export default interface IApp {
  start: (port: number, log?: boolean) => void;
  route: (path: string, router: Router) => void;
  app: Application;
  db: Sequelize;
}
