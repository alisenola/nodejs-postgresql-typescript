import type IService from "../../../interfaces/IService";
import type IUser from "../../../models/interfaces/IUser";

export default interface IUserService {
    findAll: () => IService<{ users: IUser[] }>;
    findById: (id: string) => IService<{ user: IUser }>;
    deleteUser: (id: string) => IService<void>;
    update: (userId: string, body: IUser) => IService<void>;
    loginUser: (email: string, password: string) => IService<{token: string}>;
    registerUser: (body: IUser) => IService<{
        user: IUser,
        token: string
    }>;
    logoutUser: () => IService<void>;
    forgotPassword: (
        email: string,
        protocol: string,
        host: string | undefined
    ) => IService<{
        email: string
    }>;
  }
  