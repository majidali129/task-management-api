import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();

    if (existingUser) {
      throw new BadRequestException('User with credentials already exits.');
    }

    const createdUser = await this.userModel.create(createUserDto);
    if (!createdUser) {
      throw new InternalServerErrorException(
        'Error while creating user. Please try again later',
      );
    }

    return createdUser;
  }

  async getUserById(userId: string) {
    return await this.userModel.findById(userId).exec();
  }
  async getUserByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }
}
