import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { load } from 'js-yaml';

import 'dotenv/config';
import { join } from 'path';
import { readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const yamlPath = join(process.cwd(), 'docs/api', 'openapi.yaml');
  const fileContents = readFileSync(yamlPath, 'utf8');

  const document = load(fileContents) as Record<string, any>;

  SwaggerModule.setup('api', app, document as any);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
