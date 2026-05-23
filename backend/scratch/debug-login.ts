import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/server/app.module';
import { AuthService } from '../src/modules/auth/auth.service';

async function debugLogin() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const authService = app.get(AuthService);

  try {
    console.log('Attempting login for admin@example.com...');
    const result = await authService.login({
      // email: 'admin@example.com',
      email: 'admin@hotmail.com',
      password: 'Password123!'
    });
    console.log('Login Success!', result);
  } catch (err: any) {
    console.error('Login Failed with error:', err);
    if (err.response) {
        console.error('Response:', err.response);
    }
  } finally {
    await app.close();
  }
}

debugLogin();
