/** Parse values like `15m`, `7d`, `3600s` into seconds (defaults if invalid). */
export declare function parseDurationToSeconds(expiresIn: string, fallbackSeconds: number): number;
/** Parse values like `7d` into an absolute expiry date. */
export declare function parseDurationToDate(expiresIn: string, from?: Date): Date;
//# sourceMappingURL=auth-time.util.d.ts.map