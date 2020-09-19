import { NestFactory } from '@nestjs/core';
import { from } from 'rxjs';
import { AppModule } from './app.module';
import {votingResultCalculation} from "./proposal/cronJobs"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(4000);
  await votingResultCalculation();
}
bootstrap();
