import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { ConfirmCodeDto } from './dtos/confirmcode.dto';
import { ForgetPasswordDto } from './dtos/forgetpassword.dto';
import { ResetPasswordDto } from './dtos/resetpassword.dto';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   Sign up route
  @Post('signup')
  signUp(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  //   Sign in route
  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  //   Forget password route (with email)
  @Post('forgetpassword')
  forgetPassword(@Body() forgetPassword: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPassword);
  }

  // Confirm code
  @Post('confirmcode')
  confirmCode(@Body() confirmCodeDto: ConfirmCodeDto) {
    return this.authService.confirmCode(confirmCodeDto);
  }

  //   Create new password route
  @Post('resetpassword')
  resetPassword(@Body() resetPassword: ResetPasswordDto) {
    return this.authService.resetPassword(resetPassword);
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
