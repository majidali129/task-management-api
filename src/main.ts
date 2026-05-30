import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { load } from 'js-yaml';

import 'dotenv/config';
import { join } from 'path';
import { readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory(errors) {
        const formattedErrors = errors.reduce(
          (accumulator, error) => {
            accumulator[error.property] = Object.values(
              error.constraints || {},
            );
            return accumulator;
          },
          {} as Record<string, string[]>,
        );

        return new BadRequestException({
          statusCode: 400,
          error: 'Validation Failed',
          message: 'One or more fields failed validation constraints.',
          details: formattedErrors,
        });
      },
    }),
  );
  app.enableCors();
  const yamlPath = join(process.cwd(), 'docs/api', 'openapi.yaml');
  const fileContents = readFileSync(yamlPath, 'utf8');

  const document = load(fileContents) as Record<string, any>;

  SwaggerModule.setup('api', app, document as any);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
