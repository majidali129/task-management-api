import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/schemas/create-user.dto';
import { LoginUserDto } from 'src/schemas/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  signUpUser(@Body() signUpData: CreateUserDto) {
    return this.authService.signUp(signUpData);
  }

  @Post('/login')
  signInUser(@Body() signInData: LoginUserDto) {
    return this.authService.signIn(signInData);
  }
}
