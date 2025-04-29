import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URL);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();
