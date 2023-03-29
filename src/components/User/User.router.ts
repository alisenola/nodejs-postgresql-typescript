import { Router } from "express";

import type IMiddleware from "../../interfaces/IMiddleware";
import type IUserController from "./interfaces/IUserController";
import type IUserRouter from "./interfaces/IUserRouter";
import type IUserValidator from "./interfaces/IUserValidator";

export default class UserRouter implements IUserRouter {
  private readonly _router: Router;

  constructor(
    private controller: IUserController,
    private validator: IUserValidator
  ) {
    const router = (this._router = Router());

    router.get("/", this.createRoute("findAll"));
    router.post("/auth/register", this.createRoute("registerUser", false));
    router.post("/auth/login", this.createRoute("loginUser", false));
    router.post("/auth/logout", this.createRoute("logoutUser"));
    router.post("/auth/forgotPassword", this.createRoute("forgotPassword", false));
    router.get("/:id", this.createRoute("findById"));
    router.delete("/:id", this.createRoute("deleteUser"));
    router.put("/:id", this.createRoute("update"));
  }

  private createRoute(name: string, requireLogin = true) {
    if (requireLogin) {
      return [this.getValidator(name), this.getController(name)].flat();
    }
    return [this.getValidator(name), this.getController(name)].flat();
  }

  get router() {
    return this._router;
  }

  getValidator(name: string): IMiddleware[] {
    if (name) {
      return [];
    }
    
    return []
  }

  getController(name: string): IMiddleware | IMiddleware[] {
    switch (name) {
      case "findAll":
        return this.controller.findAll;
      case "registerUser":
        return this.controller.registerUser;
      case "loginUser":
        return this.controller.loginUser;
      case "logoutUser":
        return this.controller.logoutUser;
      case "forgotPassword":
        return this.controller.forgotPassword;
      case "findById":
        return this.controller.findById;
      case "deleteUser":
        return this.controller.deleteUser;
      case "update":
        return this.controller.update;
      default:
        return [];
    }
  }
}
