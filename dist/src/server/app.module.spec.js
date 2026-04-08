"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_module_1 = require("./app.module");
(0, vitest_1.describe)('AppModule', () => {
    (0, vitest_1.it)('should be defined', () => {
        (0, vitest_1.expect)(app_module_1.AppModule).toBeDefined();
    });
});
//# sourceMappingURL=app.module.spec.js.map