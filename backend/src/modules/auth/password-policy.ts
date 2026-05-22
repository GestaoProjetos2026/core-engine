/** RNF08 — reject trivial passwords (minimal MVP list; extend as needed). */
const COMMON_PASSWORDS = new Set(
  [
    'password',
    'password123',
    '1234567890',
    'qwerty123',
    'admin123',
    'welcome123',
    'letmein123',
    'sunshine1',
    'iloveyou1',
    'princess1',
    'football1',
    'baseball1',
    'dragon123',
    'master123',
    'login123',
    'abc1234567',
  ].map((s) => s.toLowerCase()),
);

export function assertStrongPassword(password: string): void {
  if (password.length < 10) {
    throw new Error('Password must be at least 10 characters');
  }
  if (!/[a-z]/.test(password)) {
    throw new Error('Password must include a lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must include an uppercase letter');
  }
  if (!/\d/.test(password)) {
    throw new Error('Password must include a number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new Error('Password must include a special character');
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    throw new Error('Password is too common; choose a stronger one');
  }
}
