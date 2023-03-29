import { Sequelize } from "sequelize";
import Joi from "joi";
import bcrypt from "bcryptjs";
import type IService from "../../interfaces/IService";
import type IUser from "../../models/interfaces/IUser";
import type IUserService from "./interfaces/IUserService";
import IJwtService from "../../services/jwt/interfaces/IJwtService";
import IEmailService from "../../services/email/interfaces/IEmailService";

export default class UserService implements IUserService {
    constructor(
        private jwtService: IJwtService,
        private emailService: IEmailService,
        private db: Sequelize
      ) { 
      }
    
    findAll = async (): IService<{ users: IUser[] }> => {
        try {
            const users = await this.db.models.Users.findAll();
            return {
                accepted: true,
                data: {
                    users: users.map((row: any) => ({
                        id: row.id,
                        name: row.name,
                        email: row.email,
                        username: row.username,
                        password: row.password,
                        resetPasswordToken: row.resetPasswordToken,
                        resetPasswordTime: row.resetPasswordTime
                    }))
                }
            };
        } catch (e: any) {
            return {
                accepted: false,
                error: { status: 500, message: e },
              }
        }
    };
    findById = async (id: string): IService<{ user: IUser }> => {
        try {
            const user: any = await this.db.models.Users.findByPk(id);
            if (!user) {
                return {
                    accepted: false,
                    error: { status: 404, message: 'Not Found User' },
                }
            }
            return {
                accepted: true,
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        password: user.password,
                        resetPasswordToken: user.resetPasswordToken,
                        resetPasswordTime: user.resetPasswordTime
                    }
                }
            };
        } catch (e: any) {
            return {
                accepted: false,
                error: { status: 500, message: e },
              }
        }
    };
    deleteUser = async (id: string): IService<void> => {
        try {
            await this.db.models.Users.destroy({
                where: {
                    id
                }
            })
            return {
                accepted: true,
            };
        } catch (e: any) {
            return {
                accepted: false,
                error: { status: 500, message: e },
              }
        }
    };
    update = async (id: string, body: IUser): IService<void> => {
        try {
            await this.db.models.Users.update(body, {
                where: {
                    id
                }
            })
            return {
                accepted: true,
            };
        } catch (e: any) {
            return {
                accepted: false,
                error: { status: 500, message: e },
              }
        }
    };
    registerUser = async (body: IUser): IService<{
        user: IUser,
        token: string
    }> => {
        const { name, email, password, username } = body;
        if (!name || !email || !password || !username) {
            return {
                accepted: false,
                error: {
                    status: 500, message: "All fields are required."
                },
            };
          }

        try {
            const emailExists = await this.db.models.Users.findOne({ where: { email }});
            const usernameExists = await this.db.models.Users.findOne({ where: { username }});
            const userSchema = Joi.object({
                name: Joi.string().min(3).required(),
                email: Joi.string().email().required(),
                username: Joi.string().min(3).required(),
                password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
            });
            const { error, value } = userSchema.validate({
                name, email, password, username
            });
            if (error) {
                console.log(error);
                return {
                    accepted: false,
                    error: {
                        status: 500, message: error.details[0].message
                    }
                };
            } else {
                console.log(value);
            }
                    
            if (emailExists || usernameExists) {
                return {
                    accepted: false,
                    error: {
                        status: 500, 
                        message: "Email or username already exists."
                    }
                };
            }
                    
            // Create a new user and save to the database
            const user: any = new this.db.models.Users();
            user.set('name', name)
            user.set('email', email)
            user.set('password', password)
            user.set('username', username)
            await user.save();

            const payload = { id: user.id };
            const refreshPayload = { email, password };
            const jwtResponse = await this.jwtService.sign(payload, refreshPayload);
            if (!jwtResponse.accepted) throw new Error();

            const { token, refresh } = jwtResponse.data!;
            
            return {
                accepted: true,
                data: {
                    user,
                    token
                }
            };
        } catch (e: any) {
            return {
                accepted: false,
                error: { status: 500, message: e },
              }
        }
    };
    loginUser = async (email: string, password: string): IService<{token: string}> => {
        try {
            // Find user by email
            const user: any = await this.db.models.Users.findOne({ where: { email } });
                    
            if (!user) {
                return {
                    accepted: false,
                    error: {
                        status: 500,
                        message: 'Invalid email or password.'
                    }
                };
            }
  
            const isMatch = await bcrypt.compare(password, user.password)
                    
            if (!isMatch) {
                return {
                    accepted: false,
                    error: {
                        status: 500,
                        message: 'Invalid email or password.'
                    }
                };
            }
  
            const payload = { id: user.id };
            const refreshPayload = { email, password };
            const jwtResponse = await this.jwtService.sign(payload, refreshPayload);
            if (!jwtResponse.accepted) throw new Error();

            const { token, refresh } = jwtResponse.data!;
            
            return {
                accepted: true,
                data: {
                    token
                }
            };
        } catch (e: any) {
            return {
                accepted: false,
                error: { status: 500, message: e },
              }
        }
    };
    logoutUser = async (): IService<void> => {
        try {
            return {
                accepted: true,
            };
        } catch (e: any) {
            return {
                accepted: false,
                error: { status: 500, message: e },
              }
        }
    };
    forgotPassword = async (
        email: string,
        protocol: string,
        host: string | undefined
    ): IService<{
        email: string
    }> => {
        try {
            
            // Find user by email
            const user = await this.db.models.Users.findOne({ where: { email } });

            if (!user) {
                return {
                    accepted: false,
                    error: {
                        status: 401,
                        message: 'User not found'
                    }
                };
            }

            const jwtResponse = await this.jwtService.sign({}, {});
            if (!jwtResponse.accepted) throw new Error();
            
            const { token } = jwtResponse.data!;
            
            const resetPasswordUrl = `${protocol}://${host}/password/reset/${token}`;
          
            const message = `Your password reset token is :- \n\n ${resetPasswordUrl}`;
            await this.emailService.sendEmail('Reset Password', message, email);

            return {
                accepted: true,
                data: {
                    email
                }
            };
        } catch (e: any) {
            return {
                accepted: false,
                error: { status: 500, message: e },
              }
        }
    };
}