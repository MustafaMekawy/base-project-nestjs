import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';

import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { ConfirmCodeDto } from './dtos/confirmcode.dto';
import { ForgetPasswordDto } from './dtos/forgetpassword.dto';
import { ResetPasswordDto } from './dtos/resetpassword.dto';

import { SignupDto } from './dtos/signup.dto';
import { JwtGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { createResponse } from 'src/common/helpers/response/create-response.helper';
import { signInDto } from './dtos/signIn.dto';
import { GetCurrentUser } from './decorators/get-user.decorator';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   Sign up route
  @Post('signup')
  async signUp(@Body() signupDto: SignupDto) {
    const user = await this.authService.signup(signupDto);
    return createResponse('user Created Successfully.', { user });
  }

  //   Sign in route
  @Post('signin')
  async signIn(@Body() signInDto: signInDto) {
    const tokens = await this.authService.signIn(signInDto);
    return createResponse('Logged In Successfully.', { ...tokens });
  }

  //   Forget password route (with email)
  @Post('forget-password')
  async forgetPassword(@Body() forgetPassword: ForgetPasswordDto) {
    const user = await this.authService.forgetPassword(forgetPassword);
    return createResponse(`check code in your email: ${user.email}`);
  }

  // Confirm code
  @Post('confirmed-code')
  confirmCode(@Body() confirmCodeDto: ConfirmCodeDto) {
    return this.authService.confirmCode(confirmCodeDto);
  }

  // resetPasswordToken dynamic param  to get reset password token to get user
  // auth/resetpassword/abcde
  @Post('resetpassword/:resetPasswordToken')
  async resetPassword(
    @Body() resetPassword: ResetPasswordDto,
    @Param('resetPasswordToken') resetPasswordToken: string,
  ) {
    const updatedUser = await this.authService.resetPassword(
      resetPasswordToken,
      resetPassword,
    );
    return createResponse('password updated successfully ', {});
  }

  // Assign new admin
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @Get('assignadmin/:id')
  assignAdmin(@Param('id') id: string) {
    return this.authService.assignAdmin(id);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const tokens = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return createResponse('new token and refresh token created', tokens);
  }
  // Logout
  @UseGuards(JwtGuard)
  @Get('logout')
  async logout(@GetCurrentUser('id') userId: string) {
    const isLogout = await this.authService.logout(userId);
    return createResponse(
      `Logged out  ${isLogout ? 'successfully' : 'failed'}`,
      null,
    );
  }
}
