import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../src/server/app.module';
import { ApiExceptionFilter } from '../src/server/common/api-exception.filter';
import { ResponseEnvelopeInterceptor } from '../src/server/common/response-envelope.interceptor';
import { randomUUID } from 'crypto';
import { Logger } from 'nestjs-pino';

async function test() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter({
      requestIdHeader: 'x-request-id',
      genReqId: () => 'test-req-id-' + randomUUID(),
    }),
  );
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
  app.useGlobalFilters(new ApiExceptionFilter());
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  console.log('--- Testing Success Response ---');
  const successRes = await app.inject({
    method: 'GET',
    url: '/health',
  });
  console.log('Status:', successRes.statusCode);
  const successBody = JSON.parse(successRes.payload);
  console.log('Body:', JSON.stringify(successBody, null, 2));

  console.log('\n--- Testing Error Response ---');
  const errorRes = await app.inject({
    method: 'GET',
    url: '/v1/non-existent-route',
  });
  console.log('Status:', errorRes.statusCode);
  const errorBody = JSON.parse(errorRes.payload);
  console.log('Body:', JSON.stringify(errorBody, null, 2));

  await app.close();
}

test().catch(console.error);
