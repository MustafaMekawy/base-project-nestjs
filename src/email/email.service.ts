import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService,private confing:ConfigService) {}

  async sendEmail(emailTo: string, subject: string, content: string) {
    try {
      const mail = await this.mailService.sendMail({
        to: emailTo,
        from: this.confing.get('EMAIL'),//add mail to send here
        subject,
        text: content,
      });

      return 'Email Sent Successfully';
    } catch (err) {
      throw err;
    }
  }
}
