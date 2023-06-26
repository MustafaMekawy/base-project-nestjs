import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailService: MailerService,
    private config: ConfigService,
  ) {}
  async sendEmail(emailOptions: ISendMailOptions): Promise<any> {
    try {
      const mail = await this.mailService.sendMail({
        from: this.config.get('EMAIL'),
        ...emailOptions,
      });
      return mail;
    } catch (err) {
      throw err;
    }
  }
}
