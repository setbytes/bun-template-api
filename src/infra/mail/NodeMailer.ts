import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EmailClient, EmailParam } from "@/core/use-cases/helpers/EmailClient";
import { environment } from "../configs/environment";

export class NodeMailer implements EmailClient {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;

  public constructor() {
    this.transporter = nodemailer.createTransport({
      host: environment.SMTP.HOST,
      port: environment.SMTP.PORT,
      secure: environment.SMTP.SECURITY,
      auth: {
        user: environment.SMTP.USERNAME,
        pass: environment.SMTP.PASSWORD
      }
    });
  }

  public async send(params: EmailParam): Promise<any> {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail({ ...params, from: params.from || environment.SMTP.USERNAME }, (error, info) => error ? reject(error) : resolve(info));
    });
  }
}
