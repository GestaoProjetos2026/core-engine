const { AuthService } = require('./dist/src/modules/auth/auth.service');
const { PrismaService } = require('./dist/src/server/prisma/prisma.service');
const { JwtService } = require('@nestjs/jwt');
const { AuditService } = require('./dist/src/modules/audit/audit.service');

async function debugLogin() {
  const prisma = new PrismaService();
  const jwt = new JwtService({ secret: 'super-secret-key-change-in-production' });
  const audit = {
    logLoginSuccess: () => {},
    logLoginFailure: (e, r) => console.log('Audit Failure:', e, r),
  };

  const authService = new AuthService(prisma, jwt, audit);

  try {
    console.log('Attempting login for admin@example.com...');
    const result = await authService.login({
      // email: 'admin@example.com',
      email: 'admin@hotmail.com',
      password: 'Password123!'
    });
    console.log('Login Success!', result);
  } catch (err) {
    console.error('Login Failed with error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();
