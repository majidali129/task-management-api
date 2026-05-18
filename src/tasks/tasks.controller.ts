import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from 'src/schemas/create-task.dto';
import { UpdateTaskDto } from 'src/schemas/update-task.dto';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/guards/auth.guard';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Post()
  createTask(@Body() newTask: CreateTaskDto, @Req() req: Request) {
    return this.tasksService.create(newTask, req.user.userId);
  }

  @Patch(':id')
  updateTask(
    @Body() updatedTask: UpdateTaskDto,
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    return this.tasksService.update(updatedTask, id, req.user.userId);
  }

  @Get()
  getAllTasks(@Req() req: Request) {
    return this.tasksService.findAll(req.user.userId);
  }

  @Get(':id')
  getTaskDetails(@Param('id') id: string, @Req() req: Request) {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @Req() req: Request) {
    return this.tasksService.delete(id, req.user.userId);
  }
}
