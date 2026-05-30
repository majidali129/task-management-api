import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { LoginUserDto } from 'src/common/dtos/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  signUpUser(@Body() signUpData: CreateUserDto) {
    return this.authService.signUp(signUpData);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signInUser(@Body() signInData: LoginUserDto) {
    return this.authService.signIn(signInData);
  }
}
