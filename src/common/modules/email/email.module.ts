import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST ?? 'smtp.sendgrid.net',
        auth: {
          user: process.env.EMAIL_AUTH_USER ?? '',
          pass: process.env.EMAIL_AUTH_PASSWORD ?? '',
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
