import { NestFactory } from '@nestjs/core';

import helmet from 'helmet';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupValidation } from './shared/setup-validation';
import { setupSwagger } from './shared/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get('APP_PORT') || 4000;

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  setupValidation(app);
  setupSwagger(app);

  await app.listen(port, () => {
    console.log('App is running on %s port', port);
  });
}
bootstrap();
