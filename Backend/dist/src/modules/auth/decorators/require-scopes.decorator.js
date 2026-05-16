"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireScopes = exports.SCOPES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.SCOPES_KEY = 'scopes';
const RequireScopes = (...scopes) => (0, common_1.SetMetadata)(exports.SCOPES_KEY, scopes);
exports.RequireScopes = RequireScopes;
//# sourceMappingURL=require-scopes.decorator.js.map