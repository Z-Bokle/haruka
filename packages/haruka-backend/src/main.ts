import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as os from 'os';
import * as cookieParser from 'cookie-parser';
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

  const ipInfo = Object.entries(os.networkInterfaces())
    .map(
      (kv) =>
        `${kv[0]}: ${kv[1]
          ?.filter(
            (f) =>
              (f.family === 'IPv4' && f.address !== '127.0.0.1') || !f.internal,
          )
          .map((f) => f.address)
          .join(' / ')}`,
    )
    .join(',\n');

  console.log('本机IP信息：\n', ipInfo);

  await app.listen(3000);
}
bootstrap();
