import type IMiddleware from "../../interfaces/IMiddleware";
import type IUserController from "./interfaces/IUserController";
import type IUserService from "./interfaces/IUserService";

export default class UserController implements IUserController {
    constructor(
        private service: IUserService,
      ) { }

    findAll: IMiddleware = async (req, res) => {
        const serviceResponse = await this.service.findAll();
        if (!serviceResponse.accepted) {
          const { status, message } = serviceResponse.error!;
          return res.status(status).json({ message });
        }
        
        return res.status(200).json({
          message: '',
          data: serviceResponse.data
        })
    };

    findById: IMiddleware = async (req, res) => {
      const id = req.params.id;
      const serviceResponse = await this.service.findById(id);
      
      if (!serviceResponse.accepted) {
        const { status, message } = serviceResponse.error!;
        return res.status(status).json({ message });
      }

      return res
        .status(200)
        .json({ message: "", data: serviceResponse.data });
    };

    deleteUser: IMiddleware = async (req, res) => {
      const id = req.params.id;
      const serviceResponse = await this.service.deleteUser(id);
      
      if (!serviceResponse.accepted) {
        const { status, message } = serviceResponse.error!;
        return res.status(status).json({ message });
      }

      return res
        .status(200)
        .json({ message: "User deleted successfully", success: true });
    };

    update: IMiddleware = async (req, res) => { 
      const { accepted, error } = await this.service.update(
        req.params.id,
        req.body
      );
  
      if (!accepted)
        return res.status(error!.status).json({ message: error!.message });
  
      return res
        .status(200)
        .json({ message: "User updated successfully", success: true });
    };

    registerUser: IMiddleware = async (req, res) => {
      const { accepted, data, error } = await this.service.registerUser(
        req.body
      );
      
      if (!accepted)
        return res.status(error!.status).json({ message: error!.message });
  
      return res
        .status(200)
        .json({ message: "User registered successfully", data: data?.user, token: data?.token });
    };

    loginUser: IMiddleware = async (req, res) => {
      const { accepted, data, error } = await this.service.loginUser(
        req.body.email,
        req.body.password
      );
      
      if (!accepted)
        return res.status(error!.status).json({ message: error!.message });
  
      return res
        .status(200)
        .json({ message: "User logined successfully", token: data?.token });
    };

    logoutUser: IMiddleware = async (req, res) => {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
    
      res.status(200).json({
        sucess:true,
        message: "Logout success"
      });
    };

    forgotPassword: IMiddleware = async (req, res) => {
      const { accepted, data, error } = await this.service.forgotPassword(
        req.body.email,
        req.protocol,
        req.get("host")
      );
      
      if (!accepted)
        return res.status(error!.status).json({ message: error!.message });
  
      return res
        .status(200)
        .json({ message: "Please check your email. We sent reset password link.", email: data?.email });
    };
}