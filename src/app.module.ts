import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import 'dotenv/config';

@Module({
  controllers: [],
  providers: [],
  imports: [
    TasksModule,
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(process.env.DB_URI!, {
      dbName: 'task-management-api',
    }),
  ],
})
export class AppModule {}
