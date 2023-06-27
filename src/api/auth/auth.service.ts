import { BcryptService } from 'src/common/services/bcrypt/bcrypt/bcrypt.service';
import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { ConfirmCodeDto } from './dtos/confirmcode.dto';
import { ResetPasswordDto } from './dtos/resetpassword.dto';

import { EmailService } from 'src/common/modules/email/email.service';
import { ErrorHandler } from 'src/common/helpers/error/errorHandler';
import CrudFactoryHelper from 'src/common/helpers/crud-factory-helper/crud.factory';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // Sign up new User
  async signup(signupDto: any): Promise<any> {
    try {
      // check if passwords match
      if (signupDto.password !== signupDto.passwordConfirm)
        throw new HttpException(
          'Passwords does not match!',
          HttpStatus.BAD_REQUEST,
        );

      delete signupDto.passwordConfirm;

      //   Hashing the password
      signupDto.password = await this.bcryptService.hashPassword(
        signupDto.password,
      );
      //   Create new user
      const newUser = await CrudFactoryHelper.create(
        this.prisma.user,
        signupDto,
      );

      delete newUser.password;

      return newUser;
    } catch (err) {
      throw new BadRequestException('Internal Error!' + `${err.message}`);
    }
  }

  //   sign in with an existing user
  async signIn(signInDto: any) {
    try {
      const user = await CrudFactoryHelper.findUnique(this.prisma.user, {
        where: { email: signInDto.email },
      });
      if (!user) ErrorHandler.createError('Wrong Email or Password!', 404);
      const isValidPassword = await this.bcryptService.comparePassword(
        signInDto.password,
        user.password,
      );
      if (!isValidPassword)
        throw new BadRequestException('Wrong Email or Password!');
      const { token, refreshToken } =
        await this.generateAccessTokenAndRefreshToken(user);
      // const jwtPayload = { id: user.id, email: user.email };

      // const token = await this.signToken(jwtPayload);
      // const refreshToken = await this.signToken(jwtPayload, {
      //   secret:
      //     this.config.get('JWT_REFRESH__TOKEN') ?? 'DEFUALT__WORD_@ TO JWY',
      //   expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRES_IN') ?? '1d',
      // });
      const updatedUser = await CrudFactoryHelper.update(
        this.prisma.user,
        { id: user.id },
        { refreshToken: refreshToken },
      );
      return { token, refreshToken };
    } catch (err) {
      throw err;
    }
  }

  // Forget password logic
  async forgetPassword(forgetPasswordDto: any) {
    try {
      // Find a user by email
      const existingUser = await CrudFactoryHelper.findUnique(
        this.prisma.user,
        {
          where: { email: forgetPasswordDto.email },
        },
      );

      // Check if user exists
      if (!existingUser) throw new NotFoundException('Wrong Email!');

      // Create reset code, encrypt it, then store it in db
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const token = await this.encrypt(
        resetCode,
        this.config.get('ENCRYPT_CODE_PASS'),
      );

      const date = Date.now() + 10 * 60 * 1000;

      // save encrypted code in db
      const user = await CrudFactoryHelper.update(
        this.prisma.user,
        { email: existingUser.email },
        {
          resetPasswordToken: token,
          resetExpiresTime: new Date(date),
        },
      );

      // Sending mail with reset code
      const testMsg = `this is reset code ${resetCode}`;
      await this.emailService.sendEmail({
        to: user.email,
        subject: 'your Password Reset Code',
        text: testMsg,
      });

      return user.email;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException('Internal Error!');
      }
      throw err;
    }
  }

  // Confirm Code validating
  async confirmCode(data: ConfirmCodeDto) {
    try {
      // Encrypt the user's entered code to compare it with the code in db
      const hashedToken = await this.encrypt(
        data.code,
        this.config.get('ENCRYPT_CODE_PASS'),
      );

      // Get user with the reset code
      const user = await this.prisma.user.findFirst({
        where: {
          resetPasswordToken: hashedToken,
        },
      });

      if (!user) throw new NotFoundException(' wrong code');
      const date = Date.now();
      if (user.resetExpiresTime < new Date(date))
        throw new BadRequestException(' the code has expierd try agin');
      //return reset password token
      return user.resetPasswordToken;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // Resetting the password
  async resetPassword(
    resetPasswordToken: string,
    resetPassword: ResetPasswordDto,
  ) {
    try {
      if (resetPassword.newPassword != resetPassword.newPasswordConfirm)
        throw new BadRequestException('password not match');

      const hashedPassword = await bcrypt.hash(resetPassword.newPassword, 10);
      const updatedUser = await this.prisma.user.updateMany({
        where: {
          resetPasswordToken: resetPasswordToken,
        },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetExpiresTime: null,
        },
      });

      return updatedUser;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException('Internal Error!');
      }
      throw err;
    }
  }

  async logout(userId: string) {
    const updateUser = await CrudFactoryHelper.update(
      this.prisma.user,
      {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      {
        refreshToken: null,
      },
    );
    return updateUser ? true : false;
  }
  async refreshToken(userRefreshToken: string) {
    const isValid = this.jwt.verifyAsync(userRefreshToken, {
      secret: this.config.get('JWT_REFRESH__TOKEN') ?? 'DEFUALT__WORD_@ TO JWY',
    });
    if (!isValid) throw new UnauthorizedException();
    const user = await CrudFactoryHelper.findOne(this.prisma.user, {
      refreshToken: userRefreshToken,
    });
    if (!user)
      throw new NotFoundException('Invalid refreshToken', {
        description: 'Invalid refreshToken',
      });
    const { token, refreshToken } =
      await this.generateAccessTokenAndRefreshToken(user);
    await CrudFactoryHelper.update(
      this.prisma.user,
      { id: user.id },
      { refreshToken: refreshToken },
    );
    return { token, refreshToken };
  }

  // create jwt
  async signToken(
    payload,
    options = {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    },
  ) {
    const jwt = await this.jwt.signAsync(payload, options);
    return jwt;
  }

  // encryption functoin
  async encrypt(text: string, secretKey: string) {
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // Assign new admin
  async assignAdmin(id: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          role: 'admin',
        },
      });

      return { message: `${user.name} is admin now.` };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException('Internal Error!');
      }
      throw err;
    }
  }
  async generateAccessTokenAndRefreshToken(user: {
    id: string;
    email: string;
  }) {
    const jwtPayload = { id: user.id, email: user.email };
    const token = await this.signToken(jwtPayload);
    const refreshToken = await this.signToken(jwtPayload, {
      secret: this.config.get('JWT_REFRESH__TOKEN') ?? 'DEFUALT__WORD_@ TO JWY',
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRES_IN') ?? '1d',
    });
    return { token, refreshToken };
  }
}
