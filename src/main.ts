import { NestFactory } from '@nestjs/core';
import { from } from 'rxjs';
import { AppModule } from './app.module';
// import {votingResultCalculation} from "./proposal/cronJobs"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
});
  await app.listen(process.env.PORT || 4000);
  // await votingResultCalculation();
}
bootstrap();
