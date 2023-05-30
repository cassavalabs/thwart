import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DsProcessorService } from './listener/ds-processor.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const listener = app.get(DsProcessorService);
  await listener.init();
  // await listener.start();
  await app.listen(3001);
}
bootstrap();
