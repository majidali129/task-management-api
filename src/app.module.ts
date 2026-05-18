import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    TasksModule,
    AuthModule,
    MongooseModule.forRoot(process.env.DB_URI!, {
      dbName: 'task-management-api',
    }),
  ],
})
export class AppModule {}
