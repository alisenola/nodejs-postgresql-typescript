import IService from "../../../interfaces/IService";

export default interface IEmailService {
  sendEmail: (subject: string, body: string, reciever: string) => IService<boolean>;
}
