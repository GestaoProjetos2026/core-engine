"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDurationToSeconds = parseDurationToSeconds;
exports.parseDurationToDate = parseDurationToDate;
/** Parse values like `15m`, `7d`, `3600s` into seconds (defaults if invalid). */
function parseDurationToSeconds(expiresIn, fallbackSeconds) {
    const m = /^(\d+)([smhd])$/i.exec(expiresIn.trim());
    const qty = m?.[1];
    const unit = m?.[2];
    if (!qty || !unit)
        return fallbackSeconds;
    const n = parseInt(qty, 10);
    const u = unit.toLowerCase();
    switch (u) {
        case 's':
            return n;
        case 'm':
            return n * 60;
        case 'h':
            return n * 3600;
        case 'd':
            return n * 86400;
        default:
            return fallbackSeconds;
    }
}
/** Parse values like `7d` into an absolute expiry date. */
function parseDurationToDate(expiresIn, from = new Date()) {
    const m = /^(\d+)([smhd])$/i.exec(expiresIn.trim());
    const qty = m?.[1];
    const unit = m?.[2];
    if (!qty || !unit) {
        return new Date(from.getTime() + 7 * 86400_000);
    }
    const n = parseInt(qty, 10);
    const u = unit.toLowerCase();
    const ms = u === 's'
        ? n * 1000
        : u === 'm'
            ? n * 60_000
            : u === 'h'
                ? n * 3_600_000
                : n * 86_400_000;
    return new Date(from.getTime() + ms);
}
//# sourceMappingURL=auth-time.util.js.map