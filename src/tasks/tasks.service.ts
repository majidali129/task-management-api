import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from 'src/schemas/create-task.dto';
import { Task } from 'src/schemas/task.schema';
import { UpdateTaskDto } from 'src/schemas/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<{
    message: string;
    status: HttpStatus;
    task: Task;
  }> {
    const createdTask = await this.taskModel.create({
      ...createTaskDto,
      userId,
    });
    return {
      message: 'Task created successfully',
      status: HttpStatus.CREATED,
      task: createdTask,
    };
  }

  async update(
    updateTaskDto: UpdateTaskDto,
    id: string,
    userId: string,
  ): Promise<{
    message: string;
    status: HttpStatus;
    task: Task;
  }> {
    const task = await this.taskModel
      .findOne({
        _id: id,
        userId,
      })
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found or have been deleted');
    }

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();

    if (!updatedTask) {
      throw new HttpException('Failed to update task', 500);
    }
    return {
      message: 'Task updated successfully',
      status: HttpStatus.OK,
      task: updatedTask,
    };
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId }).exec();
  }

  async findOne(
    id: string,
    userId: string,
  ): Promise<{ message: string; task: Task }> {
    const task = await this.taskModel
      .findOne({
        _id: id,
        userId,
      })
      .exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return {
      message: 'Task fetched successfully',
      task,
    };
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<{ message: string; id: string }> {
    const task = await this.taskModel
      .findOne({
        _id: id,
        userId,
      })
      .exec();
    if (!task) {
      throw new NotFoundException(
        'Task not found or have already been deleted',
      );
    }
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new HttpException('Failed to delete task', 500);
    }

    return {
      message: 'Task deleted successfully',
      id,
    };
  }
}
