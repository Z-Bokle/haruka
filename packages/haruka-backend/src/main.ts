import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as os from 'os';
import * as cookieParser from 'cookie-parser';
import { statSync } from 'fs';
import { join } from 'path';
import { FileManager } from './utils/file';

function logIpInfo() {
  const ipInfo = Object.fromEntries(
    Object.entries(os.networkInterfaces()).map((kv) => [
      kv[0],
      kv[1]?.map((f) => f.address),
    ]),
  );
  console.log('本机IP信息');
  console.table(ipInfo);
}

function prepareStaticFileDictionary() {
  const targetDictorys = [
    ['statics'],
    ['statics', 'uploads'],
    ['statics', 'audio'],
    ['statics', 'video'],
  ];

  const basePath = process.cwd();
  targetDictorys.forEach((dics) => {
    const targetPath = join(basePath, ...dics);
    FileManager.createDir(targetPath);
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('NestJS')
    .setDescription('NestJS API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  logIpInfo();
  prepareStaticFileDictionary();

  await app.listen(3000);
}
bootstrap();
