import type IApp from "../../app/interfaces/IApp";
import JwtService from "../../services/jwt/jwt.service";
import EmailService from "../../services/email/email.service";
import type IUserModule from "./interfaces/IUserModule";
import UserController from "./User.controller";
import UserRouter from "./User.router";
import UserService from "./User.service";
import UserValidator from "./User.validator";

export default class UserModule implements IUserModule {
  constructor(private app: IApp) {
    const service = new UserService(new JwtService(), new EmailService(), app.db);
    const controller = new UserController(service);

    const validator = new UserValidator();

    const router = new UserRouter(controller, validator);
    app.route("/user", router.router);
  }
}
