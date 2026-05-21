"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var pg_1 = require("pg");
var adapter_pg_1 = require("@prisma/adapter-pg");
var dotenv = __importStar(require("dotenv"));
var bcrypt = __importStar(require("bcrypt"));
dotenv.config();
var pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
var adapter = new adapter_pg_1.PrismaPg(pool);
var prisma = new client_1.PrismaClient({ adapter: adapter });
var permissionDefs = [
    // Identity & Access Management (IAM)
    { code: 'users:read', description: 'Visualizar lista e detalhes de usuários' },
    { code: 'users:write', description: 'Criar, atualizar e excluir usuários' },
    { code: 'roles:read', description: 'Visualizar papéis de acesso' },
    { code: 'roles:write', description: 'Criar e atualizar papéis' },
    { code: 'roles:manage', description: 'Vincular usuários e permissões a papéis' },
    { code: 'permissions:read', description: 'Visualizar catálogo de permissões' },
    { code: 'permissions:write', description: 'Gerenciar permissões do sistema' },
    // Integration & M2M
    { code: 'applications:read', description: 'Visualizar aplicações integradas' },
    { code: 'applications:write', description: 'Gerenciar aplicações e segredos' },
    { code: 'scopes:read', description: 'Visualizar catálogo de escopos' },
    { code: 'scopes:write', description: 'Gerenciar escopos e vínculos' },
    // Observability & System
    { code: 'audit:read', description: 'Visualizar logs de auditoria e eventos críticos' },
    { code: 'health:read', description: 'Visualizar status de saúde do sistema' },
    { code: 'dashboard:read', description: 'Visualizar resumo e métricas do dashboard' },
    // Domain Placeholders (Consumer Squads / ERP Modules)
    { code: 'orders:read', description: 'Visualizar pedidos (Módulo Vendas)' },
    { code: 'orders:write', description: 'Gerenciar pedidos (Módulo Vendas)' },
    { code: 'customers:read', description: 'Visualizar clientes (Módulo CRM)' },
    { code: 'customers:write', description: 'Gerenciar clientes (Módulo CRM)' },
    { code: 'products:read', description: 'Visualizar catálogo de produtos' },
    { code: 'products:write', description: 'Gerenciar catálogo de produtos' },
    { code: 'inventory:read', description: 'Visualizar estoque' },
    { code: 'inventory:write', description: 'Movimentar estoque' },
];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var permissions, adminRole, viewerRole, managerRole, _i, permissions_1, permission, viewerPerms, _a, viewerPerms_1, permission, managerPerms, _b, managerPerms_1, permission, defaultPassword, passwordHash, adminUser, viewerUser, testAppSecret, testAppSecretHash, testApp, scopeDefs, scopes, _c, scopes_1, scope;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.all(permissionDefs.map(function (p) {
                        return prisma.permission.upsert({
                            where: { code: p.code },
                            update: { description: p.description },
                            create: { code: p.code, description: p.description },
                        });
                    }))];
                case 1:
                    permissions = _d.sent();
                    console.log("\u2705 ".concat(permissions.length, " permissions upserted"));
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'admin' },
                            update: {},
                            create: { name: 'admin' },
                        })];
                case 2:
                    adminRole = _d.sent();
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'viewer' },
                            update: {},
                            create: { name: 'viewer' },
                        })];
                case 3:
                    viewerRole = _d.sent();
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'manager' },
                            update: {},
                            create: { name: 'manager' },
                        })];
                case 4:
                    managerRole = _d.sent();
                    console.log('✅ Roles (admin, viewer, manager) upserted');
                    _i = 0, permissions_1 = permissions;
                    _d.label = 5;
                case 5:
                    if (!(_i < permissions_1.length)) return [3 /*break*/, 8];
                    permission = permissions_1[_i];
                    return [4 /*yield*/, prisma.rolePermission.upsert({
                            where: {
                                roleId_permissionId: {
                                    roleId: adminRole.id,
                                    permissionId: permission.id,
                                },
                            },
                            update: {},
                            create: {
                                roleId: adminRole.id,
                                permissionId: permission.id,
                            },
                        })];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log('✅ Admin linked to all permissions');
                    viewerPerms = permissions.filter(function (p) { return p.code.endsWith(':read'); });
                    _a = 0, viewerPerms_1 = viewerPerms;
                    _d.label = 9;
                case 9:
                    if (!(_a < viewerPerms_1.length)) return [3 /*break*/, 12];
                    permission = viewerPerms_1[_a];
                    return [4 /*yield*/, prisma.rolePermission.upsert({
                            where: {
                                roleId_permissionId: {
                                    roleId: viewerRole.id,
                                    permissionId: permission.id,
                                },
                            },
                            update: {},
                            create: {
                                roleId: viewerRole.id,
                                permissionId: permission.id,
                            },
                        })];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11:
                    _a++;
                    return [3 /*break*/, 9];
                case 12:
                    console.log("\u2705 Viewer linked to ".concat(viewerPerms.length, " read permissions"));
                    managerPerms = permissions.filter(function (p) {
                        return p.code.endsWith(':read') ||
                            p.code.startsWith('orders:') ||
                            p.code.startsWith('customers:') ||
                            p.code.startsWith('products:') ||
                            p.code.startsWith('inventory:');
                    });
                    _b = 0, managerPerms_1 = managerPerms;
                    _d.label = 13;
                case 13:
                    if (!(_b < managerPerms_1.length)) return [3 /*break*/, 16];
                    permission = managerPerms_1[_b];
                    return [4 /*yield*/, prisma.rolePermission.upsert({
                            where: {
                                roleId_permissionId: {
                                    roleId: managerRole.id,
                                    permissionId: permission.id,
                                },
                            },
                            update: {},
                            create: {
                                roleId: managerRole.id,
                                permissionId: permission.id,
                            },
                        })];
                case 14:
                    _d.sent();
                    _d.label = 15;
                case 15:
                    _b++;
                    return [3 /*break*/, 13];
                case 16:
                    console.log("\u2705 Manager linked to ".concat(managerPerms.length, " permissions"));
                    defaultPassword = 'Password123!';
                    return [4 /*yield*/, bcrypt.hash(defaultPassword, 12)];
                case 17:
                    passwordHash = _d.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'admin@example.com' },
                            update: { passwordHash: passwordHash },
                            create: {
                                email: 'admin@example.com',
                                name: 'Admin User',
                                passwordHash: passwordHash,
                                status: 'ACTIVE',
                            },
                        })];
                case 18:
                    adminUser = _d.sent();
                    return [4 /*yield*/, prisma.userRole.upsert({
                            where: {
                                userId_roleId: {
                                    userId: adminUser.id,
                                    roleId: adminRole.id,
                                },
                            },
                            update: {},
                            create: {
                                userId: adminUser.id,
                                roleId: adminRole.id,
                            },
                        })];
                case 19:
                    _d.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'viewer@example.com' },
                            update: { passwordHash: passwordHash },
                            create: {
                                email: 'viewer@example.com',
                                name: 'Viewer User',
                                passwordHash: passwordHash,
                                status: 'ACTIVE',
                            },
                        })];
                case 20:
                    viewerUser = _d.sent();
                    return [4 /*yield*/, prisma.userRole.upsert({
                            where: {
                                userId_roleId: {
                                    userId: viewerUser.id,
                                    roleId: viewerRole.id,
                                },
                            },
                            update: {},
                            create: {
                                userId: viewerUser.id,
                                roleId: viewerRole.id,
                            },
                        })];
                case 21:
                    _d.sent();
                    console.log('✅ Default users created and linked to roles');
                    console.log('   - admin@example.com / Password123!');
                    console.log('   - viewer@example.com / Password123!');
                    testAppSecret = 'test-client-secret';
                    return [4 /*yield*/, bcrypt.hash(testAppSecret, 12)];
                case 22:
                    testAppSecretHash = _d.sent();
                    return [4 /*yield*/, prisma.application.upsert({
                            where: { clientId: 'test-client-id' },
                            update: { clientSecretHash: testAppSecretHash, status: 'ACTIVE' },
                            create: {
                                name: 'Test Application',
                                clientId: 'test-client-id',
                                clientSecretHash: testAppSecretHash,
                                status: 'ACTIVE',
                            },
                        })];
                case 23:
                    testApp = _d.sent();
                    scopeDefs = [
                        { code: 'read:all', description: 'Leitura total (M2M)' },
                        { code: 'write:all', description: 'Escrita total (M2M)' },
                        { code: 'orders:read', description: 'Leitura de pedidos' },
                        { code: 'orders:write', description: 'Criação/alteração de pedidos' },
                        { code: 'customers:read', description: 'Leitura de clientes' },
                        { code: 'customers:write', description: 'Escrita de clientes' },
                        { code: 'products:read', description: 'Leitura de produtos' },
                        { code: 'products:write', description: 'Escrita de produtos' },
                    ];
                    return [4 /*yield*/, Promise.all(scopeDefs.map(function (s) {
                            return prisma.scope.upsert({
                                where: { code: s.code },
                                update: { description: s.description },
                                create: { code: s.code, description: s.description },
                            });
                        }))];
                case 24:
                    scopes = _d.sent();
                    console.log("\u2705 ".concat(scopes.length, " scopes upserted"));
                    _c = 0, scopes_1 = scopes;
                    _d.label = 25;
                case 25:
                    if (!(_c < scopes_1.length)) return [3 /*break*/, 28];
                    scope = scopes_1[_c];
                    return [4 /*yield*/, prisma.applicationScope.upsert({
                            where: {
                                applicationId_scopeId: {
                                    applicationId: testApp.id,
                                    scopeId: scope.id,
                                },
                            },
                            update: {},
                            create: {
                                applicationId: testApp.id,
                                scopeId: scope.id,
                            },
                        })];
                case 26:
                    _d.sent();
                    _d.label = 27;
                case 27:
                    _c++;
                    return [3 /*break*/, 25];
                case 28:
                    console.log('✅ Test Application linked to all scopes');
                    console.log('   - clientId: test-client-id / clientSecret: test-client-secret');
                    console.log('\n🎉 Seed completed');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
