import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API Documentation for My Project')
    .setVersion('1.0')
    .addBearerAuth() // 🔐 Adds Authorization header for JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/swagger', app, document); // docs path 'docs/swagger'

  // app.enableCors();
  // app.setGlobalPrefix('api'); // Set a global prefix for all routes (e.g., /api/users)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
