import { describe, expect, it } from 'vitest';
import { parseDurationToDate, parseDurationToSeconds } from './auth-time.util';

describe('parseDurationToSeconds', () => {
  it('parses minutes', () => {
    expect(parseDurationToSeconds('15m', 0)).toBe(900);
  });
  it('parses days', () => {
    expect(parseDurationToSeconds('7d', 0)).toBe(604800);
  });
  it('uses fallback when invalid', () => {
    expect(parseDurationToSeconds('bogus', 42)).toBe(42);
  });
});

describe('parseDurationToDate', () => {
  it('adds duration to reference date', () => {
    const from = new Date('2026-01-01T00:00:00.000Z');
    const out = parseDurationToDate('1d', from);
    expect(out.toISOString()).toBe('2026-01-02T00:00:00.000Z');
  });
  it('defaults to 7d when invalid', () => {
    const from = new Date('2026-01-01T00:00:00.000Z');
    const out = parseDurationToDate('invalid', from);
    expect(out.getTime() - from.getTime()).toBe(7 * 86400_000);
  });
});
