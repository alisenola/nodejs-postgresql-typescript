import type IMiddleware from "../../../interfaces/IMiddleware";

export default interface IUserController {
  findAll: IMiddleware;
  registerUser: IMiddleware;
  loginUser: IMiddleware;
  logoutUser: IMiddleware;
  forgotPassword: IMiddleware;
  findById: IMiddleware;
  deleteUser: IMiddleware;
  update: IMiddleware;
}
