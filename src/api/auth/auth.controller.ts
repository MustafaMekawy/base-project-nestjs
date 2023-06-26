import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';

import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { ConfirmCodeDto } from './dtos/confirmcode.dto';
import { ForgetPasswordDto } from './dtos/forgetpassword.dto';
import { ResetPasswordDto } from './dtos/resetpassword.dto';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';
import { JwtGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { createResponse } from 'src/common/helpers/response/create-response.helper';

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
  async signin(@Body() signinDto: SigninDto) {
    const token = await this.authService.signin(signinDto);
    return createResponse('Logged In Successfully.', { token });
  }

  //   Forget password route (with email)
  @Post('forget-password')
  forgetPassword(@Body() forgetPassword: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPassword);
  }

  // Confirm code
  @Post('confirmed-code')
  confirmCode(@Body() confirmCodeDto: ConfirmCodeDto) {
    return this.authService.confirmCode(confirmCodeDto);
  }

  // resetPasswordToken dynamic param  to get reset password token to get user
  // auth/resetpassword/abcde
  @Post('resetpassword/:resetPasswordToken')
  resetPassword(
    @Body() resetPassword: ResetPasswordDto,
    @Param('resetPasswordToken') resetPasswordToken: string,
  ) {
    return this.authService.resetPassword(resetPasswordToken, resetPassword);
  }

  // Assign new admin
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @Get('assignadmin/:id')
  assignAdmin(@Param('id') id: string) {
    return this.authService.assignAdmin(id);
  }

  // Logout
  @UseGuards(JwtGuard)
  @Get('logout')
  logout() {
    return { message: 'Logged out successfully.' };
  }
}
