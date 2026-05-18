import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import type { Request } from 'express';
import 'dotenv/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: Request = ctx.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '').trim();
    if (!token) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        sub: string;
        email: string;
      };
      const user = await this.userModel.findById(decoded.sub);

      if (!user) {
        throw new UnauthorizedException(
          'Unauthorized Access. Please login to proceed',
        );
      }

      req.user = { userId: decoded.sub, email: decoded.email };
      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message ?? 'Invalid token');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
