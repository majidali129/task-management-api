import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { LoginUserDto } from 'src/common/dtos/login-user.dto';
import { User } from 'src/schemas/user.schema';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<{
    message: string;
    status: HttpStatus;
  }> {
    await this.userService.create(createUserDto);

    return {
      message: 'User created successfully',
      status: HttpStatus.CREATED,
    };
  }

  async signIn(
    loginData: LoginUserDto,
  ): Promise<{ message: string; token: string }> {
    const user = await this.userService.getUserByEmail(loginData.email);

    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.generateToken(user._id.toString());
    await user.save({ validateBeforeSave: false });

    return { message: 'Login successful', token };
  }

  async generateToken(userId: string): Promise<string> {
    const payload = { sub: userId };
    return await this.jwtService.signAsync(payload);
  }
}
