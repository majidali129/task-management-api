import { IsString, IsOptional, IsEnum } from 'class-validator';
export const TaskStatusValues = [
  'pending',
  'in-progress',
  'completed',
] as const;

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsEnum(TaskStatusValues, {
    message: `status must be one of the following values: ${TaskStatusValues.join(', ')}`,
  })
  @IsOptional()
  readonly status?: string;
}
