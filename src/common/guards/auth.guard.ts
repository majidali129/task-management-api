import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import type { Request } from 'express';
import 'dotenv/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: Request = ctx.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    try {
      const payload: { sub: string } = await this.jwtService.verifyAsync(token);

      const user = await this.userService.getUserById(payload.sub);

      if (!user) {
        throw new UnauthorizedException(
          'Unauthorized Access. Please login to proceed',
        );
      }

      req.user = { userId: payload.sub };
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message ?? 'Invalid token');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }

  extractTokenFromHeader(req: Request) {
    const authHeader = req.headers.authorization;
    return authHeader?.replace('Bearer ', '').trim();
  }
}
