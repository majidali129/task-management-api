import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/schemas/create-user.dto';
import { LoginUserDto } from 'src/schemas/login-user.dto';
import { User } from 'src/schemas/user.schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signUp(userData: CreateUserDto): Promise<{
    id: string;
    message: string;
    status: HttpStatus;
  }> {
    const existingUser = await this.userModel
      .findOne({ email: userData.email })
      .exec();

    if (existingUser) {
      throw new BadRequestException('User with credentials already exits.');
    }
    const createdUser = await this.userModel.create(userData);
    return {
      id: createdUser._id.toString(),
      message: 'User created successfully',
      status: HttpStatus.CREATED,
    };
  }

  async signIn(
    loginData: LoginUserDto,
  ): Promise<{ message: string; userId: string; token: string }> {
    const user = await this.userModel
      .findOne({ email: loginData.email })
      .exec();

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

    const token = await this.generateToken(user._id.toString(), user.email);
    user.token = token;
    await user.save({ validateBeforeSave: false });

    return { message: 'Login successful', userId: user._id.toString(), token };
  }

  async generateToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '3h' });
  }
}
