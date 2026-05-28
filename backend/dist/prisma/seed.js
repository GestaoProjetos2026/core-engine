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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var adapter_pg_1 = require("@prisma/adapter-pg");
var pg_1 = require("pg");
var dotenv = __importStar(require("dotenv"));
var bcrypt = __importStar(require("bcrypt"));
var seed_data_1 = require("./seed-data");
dotenv.config();
var pool = new pg_1.Pool(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : undefined);
var schema = 'core_engine';
if (process.env.DATABASE_URL) {
    try {
        var url = new URL(process.env.DATABASE_URL);
        schema = url.searchParams.get('schema') || 'core_engine';
    }
    catch (e) { }
}
var adapter = new adapter_pg_1.PrismaPg(pool, { schema: schema });
var prisma = new client_1.PrismaClient({ adapter: adapter });
var isProduction = process.env.NODE_ENV === 'production';
var updatePasswords = process.env.SEED_UPDATE_PASSWORDS === 'true' ||
    (!isProduction && process.env.SEED_UPDATE_PASSWORDS !== 'false');
var permissionDefs = [
    { code: 'users:read', description: 'Visualizar lista e detalhes de usuários' },
    { code: 'users:write', description: 'Criar, atualizar e excluir usuários' },
    { code: 'roles:read', description: 'Visualizar papéis de acesso' },
    { code: 'roles:write', description: 'Criar e atualizar papéis' },
    { code: 'roles:manage', description: 'Vincular usuários e permissões a papéis' },
    { code: 'permissions:read', description: 'Visualizar catálogo de permissões' },
    { code: 'permissions:write', description: 'Gerenciar permissões do sistema' },
    { code: 'applications:read', description: 'Visualizar aplicações integradas' },
    { code: 'applications:write', description: 'Gerenciar aplicações e segredos' },
    { code: 'scopes:read', description: 'Visualizar catálogo de escopos' },
    { code: 'scopes:write', description: 'Gerenciar escopos e vínculos' },
    { code: 'audit:read', description: 'Visualizar logs de auditoria e eventos críticos' },
    { code: 'health:read', description: 'Visualizar status de saúde do sistema' },
    { code: 'dashboard:read', description: 'Visualizar resumo e métricas do dashboard' },
    { code: 'orders:read', description: 'Visualizar pedidos (Módulo Vendas)' },
    { code: 'orders:write', description: 'Gerenciar pedidos (Módulo Vendas)' },
    { code: 'customers:read', description: 'Visualizar clientes (Módulo CRM)' },
    { code: 'customers:write', description: 'Gerenciar clientes (Módulo CRM)' },
    { code: 'products:read', description: 'Visualizar catálogo de produtos' },
    { code: 'products:write', description: 'Gerenciar catálogo de produtos' },
    { code: 'inventory:read', description: 'Visualizar estoque' },
    { code: 'inventory:write', description: 'Movimentar estoque' },
    // Squad 2 — Fiscal (não concedidas ao papel suporte)
    { code: 'finance:read', description: 'Visualizar dados financeiros e faturamento (Squad 2)' },
    { code: 'finance:write', description: 'Emitir e alterar documentos fiscais (Squad 2)' },
    // Squad 4 — Service Desk
    { code: 'tickets:read', description: 'Visualizar chamados de suporte' },
    { code: 'tickets:write', description: 'Criar e atualizar chamados de suporte' },
];
var SUPORTE_PERMISSION_CODES = [
    'customers:read',
    'tickets:read',
    'tickets:write',
    'dashboard:read',
    'health:read',
];
function linkRoleToPermissions(roleId, permissionList, codes) {
    return __awaiter(this, void 0, void 0, function () {
        var selected, _i, selected_1, permission;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selected = permissionList.filter(function (p) { return codes.includes(p.code); });
                    _i = 0, selected_1 = selected;
                    _a.label = 1;
                case 1:
                    if (!(_i < selected_1.length)) return [3 /*break*/, 4];
                    permission = selected_1[_i];
                    return [4 /*yield*/, prisma.rolePermission.upsert({
                            where: {
                                roleId_permissionId: {
                                    roleId: roleId,
                                    permissionId: permission.id,
                                },
                            },
                            update: {},
                            create: {
                                roleId: roleId,
                                permissionId: permission.id,
                            },
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, selected.map(function (p) { return p.code; })];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var permissions, adminRole, viewerRole, managerRole, suporteRole, _i, permissions_1, permission, viewerPerms, _a, viewerPerms_1, permission, managerPerms, _b, managerPerms_1, permission, suporteLinkedCodes, forbiddenForSuporte, suporteHasForbidden, defaultAdmins, _c, defaultAdmins_1, admin, passwordHash, adminUser, suportePassword, suportePasswordHash, suporteUser, testAppSecret, testAppSecretHash, testApp, scopeDefs, scopes, _d, scopes_1, scope;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.all(permissionDefs.map(function (p) {
                        return prisma.permission.upsert({
                            where: { code: p.code },
                            update: { description: p.description },
                            create: { code: p.code, description: p.description },
                        });
                    }))];
                case 1:
                    permissions = _e.sent();
                    console.log("\u2705 ".concat(permissions.length, " permissions upserted"));
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'admin' },
                            update: {},
                            create: { name: 'admin' },
                        })];
                case 2:
                    adminRole = _e.sent();
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'viewer' },
                            update: {},
                            create: { name: 'viewer' },
                        })];
                case 3:
                    viewerRole = _e.sent();
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'manager' },
                            update: {},
                            create: { name: 'manager' },
                        })];
                case 4:
                    managerRole = _e.sent();
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'suporte' },
                            update: {},
                            create: { name: 'suporte' },
                        })];
                case 5:
                    suporteRole = _e.sent();
                    console.log('✅ Roles (admin, viewer, manager, suporte) upserted');
                    _i = 0, permissions_1 = permissions;
                    _e.label = 6;
                case 6:
                    if (!(_i < permissions_1.length)) return [3 /*break*/, 9];
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
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    console.log('✅ Admin linked to all permissions');
                    viewerPerms = permissions.filter(function (p) { return p.code.endsWith(':read'); });
                    _a = 0, viewerPerms_1 = viewerPerms;
                    _e.label = 10;
                case 10:
                    if (!(_a < viewerPerms_1.length)) return [3 /*break*/, 13];
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
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12:
                    _a++;
                    return [3 /*break*/, 10];
                case 13:
                    console.log("\u2705 Viewer linked to ".concat(viewerPerms.length, " read permissions"));
                    managerPerms = permissions.filter(function (p) {
                        return p.code.endsWith(':read') ||
                            p.code.startsWith('orders:') ||
                            p.code.startsWith('customers:') ||
                            p.code.startsWith('products:') ||
                            p.code.startsWith('inventory:');
                    });
                    _b = 0, managerPerms_1 = managerPerms;
                    _e.label = 14;
                case 14:
                    if (!(_b < managerPerms_1.length)) return [3 /*break*/, 17];
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
                case 15:
                    _e.sent();
                    _e.label = 16;
                case 16:
                    _b++;
                    return [3 /*break*/, 14];
                case 17:
                    console.log("\u2705 Manager linked to ".concat(managerPerms.length, " permissions"));
                    return [4 /*yield*/, linkRoleToPermissions(suporteRole.id, permissions, SUPORTE_PERMISSION_CODES)];
                case 18:
                    suporteLinkedCodes = _e.sent();
                    forbiddenForSuporte = permissions
                        .filter(function (p) { return p.code.startsWith('finance:') || p.code.startsWith('orders:'); })
                        .map(function (p) { return p.code; });
                    suporteHasForbidden = suporteLinkedCodes.some(function (c) {
                        return forbiddenForSuporte.includes(c);
                    });
                    if (suporteHasForbidden) {
                        throw new Error('Role suporte must not include finance:* or orders:* permissions');
                    }
                    console.log("\u2705 Suporte linked to ".concat(suporteLinkedCodes.length, " permissions: ").concat(suporteLinkedCodes.join(', ')));
                    defaultAdmins = [
                        {
                            email: 'admin@hotmail.com',
                            name: 'Administrador Principal',
                            password: 'Admin12345!',
                        },
                        {
                            email: 'crm@example.com',
                            name: 'CRM',
                            password: 'CRM123456!',
                        },
                        {
                            email: 'service-desk@example.com',
                            name: 'Service Desk',
                            password: 'ServiceDesk123!',
                        },
                        {
                            email: 'fiscal@example.com',
                            name: 'Fiscal',
                            password: 'Fiscal123!',
                        },
                        {
                            email: 'devOps@example.com',
                            name: 'DevOps',
                            password: 'DevOps123!',
                        },
                    ];
                    _c = 0, defaultAdmins_1 = defaultAdmins;
                    _e.label = 19;
                case 19:
                    if (!(_c < defaultAdmins_1.length)) return [3 /*break*/, 24];
                    admin = defaultAdmins_1[_c];
                    return [4 /*yield*/, bcrypt.hash(admin.password, 12)];
                case 20:
                    passwordHash = _e.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: admin.email },
                            update: {
                                passwordHash: passwordHash,
                                status: 'ACTIVE',
                            },
                            create: {
                                email: admin.email,
                                name: admin.name,
                                passwordHash: passwordHash,
                                status: 'ACTIVE',
                            },
                        })];
                case 21:
                    adminUser = _e.sent();
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
                case 22:
                    _e.sent();
                    console.log("\u2705 Admin user ensured: ".concat(admin.email));
                    _e.label = 23;
                case 23:
                    _c++;
                    return [3 /*break*/, 19];
                case 24:
                    suportePassword = 'Suporte123!';
                    return [4 /*yield*/, bcrypt.hash(suportePassword, 12)];
                case 25:
                    suportePasswordHash = _e.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'suporte@example.com' },
                            update: {
                                passwordHash: suportePasswordHash,
                                status: 'ACTIVE',
                                name: 'Agente Suporte Demo',
                            },
                            create: {
                                email: 'suporte@example.com',
                                name: 'Agente Suporte Demo',
                                passwordHash: suportePasswordHash,
                                status: 'ACTIVE',
                            },
                        })];
                case 26:
                    suporteUser = _e.sent();
                    return [4 /*yield*/, prisma.userRole.upsert({
                            where: {
                                userId_roleId: {
                                    userId: suporteUser.id,
                                    roleId: suporteRole.id,
                                },
                            },
                            update: {},
                            create: {
                                userId: suporteUser.id,
                                roleId: suporteRole.id,
                            },
                        })];
                case 27:
                    _e.sent();
                    console.log('✅ Suporte user ensured: suporte@example.com / Suporte123!');
                    // const viewerUser = await prisma.user.upsert({
                    //   where: { email: 'viewer@example.com' },
                    //   update: { passwordHash },
                    //   create: {
                    //     email: 'viewer@example.com',
                    //     name: 'Viewer User',
                    //     passwordHash,
                    //     status: 'ACTIVE',
                    //   },
                    // });
                    // await prisma.userRole.upsert({
                    //   where: {
                    //     userId_roleId: {
                    //       userId: viewerUser.id,
                    //       roleId: viewerRole.id,
                    //     },
                    //   },
                    //   update: {},
                    //   create: {
                    //     userId: viewerUser.id,
                    //     roleId: viewerRole.id,
                    //   },
                    // });
                    //TUDO ISSO PODE SER ALTERADO DEPOIS
                    console.log('✅ Default users created and linked to roles');
                    console.log('   - admin@example.com / Password123!');
                    console.log('   - viewer@example.com / Password123!');
                    testAppSecret = 'test-client-secret';
                    return [4 /*yield*/, bcrypt.hash(testAppSecret, 12)];
                case 28:
                    testAppSecretHash = _e.sent();
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
                case 29:
                    testApp = _e.sent();
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
                case 30:
                    scopes = _e.sent();
                    console.log("\u2705 ".concat(scopes.length, " scopes upserted"));
                    _d = 0, scopes_1 = scopes;
                    _e.label = 31;
                case 31:
                    if (!(_d < scopes_1.length)) return [3 /*break*/, 34];
                    scope = scopes_1[_d];
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
                case 32:
                    _e.sent();
                    _e.label = 33;
                case 33:
                    _d++;
                    return [3 /*break*/, 31];
                case 34:
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
                return [4 /*yield*/, pool.end()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
