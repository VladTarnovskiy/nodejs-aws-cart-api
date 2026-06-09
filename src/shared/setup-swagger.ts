import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Cart API')
    .setDescription(
      'REST API for user registration, authentication, cart management, and checkout.',
    )
    .setVersion('1.0')
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
        description:
          'Use credentials from login: Authorization: Basic base64(username:password)',
      },
      'basic',
    )
    .addTag('health', 'Service health check')
    .addTag('auth', 'Registration and login')
    .addTag('profile', 'Authenticated user profile')
    .addTag('cart', 'Cart operations')
    .addTag('orders', 'Order checkout and listing')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);
}
