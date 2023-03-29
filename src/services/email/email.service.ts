import axios from "axios";
import IService from "../../interfaces/IService";
import IEmailService from "./interfaces/IEmailService";

const apiKey = process.env.EMAIL_API_KEY;
const sender = process.env.EMAIL_FROM;
const senderName = process.env.EMAIL_FROM_NAME;

export default class EmailService implements IEmailService {
  async sendEmail(
    subject: string,
    body: string,
    reciever: string
  ): IService<boolean> {
    const response = await axios.post(
      `https://api.elasticemail.com/v2/email/send?apikey=${apiKey}&from=${sender}&fromName=${senderName}&to=${reciever}&bodyHTML=${body}&subject=${subject}`
    );

    return response.data.success;
  }
}
