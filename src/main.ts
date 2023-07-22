import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(__dirname, '..', 'html'));
  app.setViewEngine('hbs');

  enableShutdownHooks(app);

  await app.listen(3000);
}

bootstrap();

function enableShutdownHooks(app: INestApplication) {
  process.on('beforeExit', async () => {
    console.log('Closing the application...');
    await app.close();
    console.log('Application closed');
  });
}
