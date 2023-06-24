import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { emailInterface } from './interface/emaill-options.interface';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService,private config:ConfigService) {}


  async sendEmail(emailOptions:emailInterface) {
    try {
      const mail = await this.mailService.sendMail({
        from: this.config.get('EMAIL'),
        ...emailOptions,
      });

      return true;
    } catch (err) {
      throw err;
    }
  }
}
