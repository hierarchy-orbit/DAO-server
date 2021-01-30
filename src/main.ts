import { NestFactory } from '@nestjs/core';
import { from } from 'rxjs';
import { AppModule } from './app.module';

const express = require('express');

const apps = express();

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: true,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true,
  // });
  const app = await NestFactory.create(AppModule, { cors: true });
  let bodyParser = require('body-parser');
  // apps.use(express.static('public'));
  app.use(bodyParser({ limit: '524288000' }));
  app.enableCors();
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
