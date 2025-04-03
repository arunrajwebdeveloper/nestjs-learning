import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { AllExceptionsFilter } from './all-exceptions.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.use(
    helmet({
      contentSecurityPolicy: false, // ✅ Disables CSP (useful for inline scripts)
      frameguard: { action: 'deny' }, // ✅ Prevents clickjacking by denying iframes
      referrerPolicy: { policy: 'no-referrer' }, // ✅ Sends no referrer information
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // ✅ Enforces HTTPS for 1 year (with preload & subdomains)
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('My NestJs Learning API')
    .setDescription('API Documentation for My NestJs Learning Project')
    .setVersion('1.0')
    .addServer('/api')
    .addBearerAuth() // 🔐 Adds Authorization header for JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/swagger', app, document); // docs path 'docs/swagger'

  app.enableCors();
  app.setGlobalPrefix('api'); // Set a global prefix for all routes (e.g., /api/users)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
