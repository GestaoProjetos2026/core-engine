"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_time_util_1 = require("./auth-time.util");
(0, vitest_1.describe)('parseDurationToSeconds', () => {
    (0, vitest_1.it)('parses minutes', () => {
        (0, vitest_1.expect)((0, auth_time_util_1.parseDurationToSeconds)('15m', 0)).toBe(900);
    });
    (0, vitest_1.it)('parses days', () => {
        (0, vitest_1.expect)((0, auth_time_util_1.parseDurationToSeconds)('7d', 0)).toBe(604800);
    });
    (0, vitest_1.it)('uses fallback when invalid', () => {
        (0, vitest_1.expect)((0, auth_time_util_1.parseDurationToSeconds)('bogus', 42)).toBe(42);
    });
});
(0, vitest_1.describe)('parseDurationToDate', () => {
    (0, vitest_1.it)('adds duration to reference date', () => {
        const from = new Date('2026-01-01T00:00:00.000Z');
        const out = (0, auth_time_util_1.parseDurationToDate)('1d', from);
        (0, vitest_1.expect)(out.toISOString()).toBe('2026-01-02T00:00:00.000Z');
    });
    (0, vitest_1.it)('defaults to 7d when invalid', () => {
        const from = new Date('2026-01-01T00:00:00.000Z');
        const out = (0, auth_time_util_1.parseDurationToDate)('invalid', from);
        (0, vitest_1.expect)(out.getTime() - from.getTime()).toBe(7 * 86400_000);
    });
});
//# sourceMappingURL=auth-time.util.spec.js.map