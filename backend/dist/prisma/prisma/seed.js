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
var tenant_1 = require("../src/shared/constants/tenant");
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
function resolveM2mSecret(def) {
    var _a;
    var fromEnv = (_a = process.env[def.secretEnvKey]) === null || _a === void 0 ? void 0 : _a.trim();
    if (fromEnv)
        return fromEnv;
    if (isProduction && def.clientId !== 'test-client-id') {
        throw new Error("Missing required env ".concat(def.secretEnvKey, " for M2M app ").concat(def.clientId, " in production"));
    }
    return def.defaultSecret;
}
function seedM2mApplication(def, scopeByCode) {
    return __awaiter(this, void 0, void 0, function () {
        var clientSecret, clientSecretHash, app, _i, _a, code, scope, squadLabel;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    clientSecret = resolveM2mSecret(def);
                    return [4 /*yield*/, bcrypt.hash(clientSecret, 12)];
                case 1:
                    clientSecretHash = _c.sent();
                    return [4 /*yield*/, prisma.application.upsert({
                            where: { clientId: def.clientId },
                            update: {
                                name: def.name,
                                clientSecretHash: clientSecretHash,
                                status: 'ACTIVE',
                            },
                            create: {
                                name: def.name,
                                clientId: def.clientId,
                                clientSecretHash: clientSecretHash,
                                status: 'ACTIVE',
                            },
                        })];
                case 2:
                    app = _c.sent();
                    _i = 0, _a = def.scopeCodes;
                    _c.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    code = _a[_i];
                    scope = scopeByCode.get(code);
                    if (!scope) {
                        throw new Error("Scope \"".concat(code, "\" not found while seeding app ").concat(def.clientId));
                    }
                    return [4 /*yield*/, prisma.applicationScope.upsert({
                            where: {
                                applicationId_scopeId: {
                                    applicationId: app.id,
                                    scopeId: scope.id,
                                },
                            },
                            update: {},
                            create: {
                                applicationId: app.id,
                                scopeId: scope.id,
                            },
                        })];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    squadLabel = (_b = def.squad) !== null && _b !== void 0 ? _b : def.name;
                    console.log("\u2705 M2M app [".concat(squadLabel, "]: ").concat(def.clientId, " (scopes: ").concat(def.scopeCodes.join(', '), ")"));
                    if (!isProduction) {
                        console.log("   \u26A0\uFE0F  Secret from env ".concat(def.secretEnvKey, " or default (demo only)"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var permissions, defaultTenant, adminRole, viewerRole, managerRole, suporteRole, _i, permissions_1, permission, viewerPerms, _a, viewerPerms_1, permission, managerPerms, _b, managerPerms_1, permission, suporteLinkedCodes, forbiddenForSuporte, suporteHasForbidden, defaultAdmins, _c, defaultAdmins_1, admin, passwordHash, adminUser, suportePassword, suportePasswordHash, suporteUser, scopeDefs, scopes, scopeByCode, _d, m2mAppDefs_1, def, _e, adminUserDefs_1, def, _f, _g, def;
        var _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    console.log("Seed mode: NODE_ENV=".concat((_h = process.env.NODE_ENV) !== null && _h !== void 0 ? _h : 'undefined', ", updatePasswords=").concat(updatePasswords));
                    return [4 /*yield*/, Promise.all(permissionDefs.map(function (p) {
                            return prisma.permission.upsert({
                                where: { code: p.code },
                                update: { description: p.description },
                                create: { code: p.code, description: p.description },
                            });
                        }))];
                case 1:
                    permissions = _j.sent();
                    console.log("\u2705 ".concat(permissions.length, " permissions upserted"));
                    return [4 /*yield*/, prisma.tenant.upsert({
                            where: { slug: tenant_1.DEFAULT_TENANT_SLUG },
                            update: { name: 'Default Organization' },
                            create: {
                                id: tenant_1.DEFAULT_TENANT_ID,
                                name: 'Default Organization',
                                slug: tenant_1.DEFAULT_TENANT_SLUG,
                            },
                        })];
                case 2:
                    defaultTenant = _j.sent();
                    console.log("\u2705 Default tenant ensured: ".concat(defaultTenant.slug, " (").concat(defaultTenant.id, ")"));
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'admin' },
                            update: {},
                            create: { name: 'admin' },
                        })];
                case 3:
                    adminRole = _j.sent();
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'viewer' },
                            update: {},
                            create: { name: 'viewer' },
                        })];
                case 4:
                    viewerRole = _j.sent();
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'manager' },
                            update: {},
                            create: { name: 'manager' },
                        })];
                case 5:
                    managerRole = _j.sent();
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'suporte' },
                            update: {},
                            create: { name: 'suporte' },
                        })];
                case 6:
                    suporteRole = _j.sent();
                    console.log('✅ Roles (admin, viewer, manager, suporte) upserted');
                    _i = 0, permissions_1 = permissions;
                    _j.label = 7;
                case 7:
                    if (!(_i < permissions_1.length)) return [3 /*break*/, 10];
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
                case 8:
                    _j.sent();
                    _j.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10:
                    console.log('✅ Admin linked to all permissions');
                    viewerPerms = permissions.filter(function (p) { return p.code.endsWith(':read'); });
                    _a = 0, viewerPerms_1 = viewerPerms;
                    _j.label = 11;
                case 11:
                    if (!(_a < viewerPerms_1.length)) return [3 /*break*/, 14];
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
                case 12:
                    _j.sent();
                    _j.label = 13;
                case 13:
                    _a++;
                    return [3 /*break*/, 11];
                case 14:
                    console.log("\u2705 Viewer linked to ".concat(viewerPerms.length, " read permissions"));
                    managerPerms = permissions.filter(function (p) {
                        return p.code.endsWith(':read') ||
                            p.code.startsWith('orders:') ||
                            p.code.startsWith('customers:') ||
                            p.code.startsWith('products:') ||
                            p.code.startsWith('inventory:');
                    });
                    _b = 0, managerPerms_1 = managerPerms;
                    _j.label = 15;
                case 15:
                    if (!(_b < managerPerms_1.length)) return [3 /*break*/, 18];
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
                case 16:
                    _j.sent();
                    _j.label = 17;
                case 17:
                    _b++;
                    return [3 /*break*/, 15];
                case 18:
                    console.log("\u2705 Manager linked to ".concat(managerPerms.length, " permissions"));
                    return [4 /*yield*/, linkRoleToPermissions(suporteRole.id, permissions, SUPORTE_PERMISSION_CODES)];
                case 19:
                    suporteLinkedCodes = _j.sent();
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
                    _j.label = 20;
                case 20:
                    if (!(_c < defaultAdmins_1.length)) return [3 /*break*/, 25];
                    admin = defaultAdmins_1[_c];
                    return [4 /*yield*/, bcrypt.hash(admin.password, 12)];
                case 21:
                    passwordHash = _j.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: {
                                tenantId_email: {
                                    tenantId: defaultTenant.id,
                                    email: admin.email,
                                },
                            },
                            update: {
                                passwordHash: passwordHash,
                                status: 'ACTIVE',
                                tenantId: defaultTenant.id,
                            },
                            create: {
                                tenantId: defaultTenant.id,
                                email: admin.email,
                                name: admin.name,
                                passwordHash: passwordHash,
                                status: 'ACTIVE',
                            },
                        })];
                case 22:
                    adminUser = _j.sent();
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
                case 23:
                    _j.sent();
                    console.log("\u2705 Admin user ensured: ".concat(admin.email));
                    _j.label = 24;
                case 24:
                    _c++;
                    return [3 /*break*/, 20];
                case 25:
                    suportePassword = 'Suporte123!';
                    return [4 /*yield*/, bcrypt.hash(suportePassword, 12)];
                case 26:
                    suportePasswordHash = _j.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: {
                                tenantId_email: {
                                    tenantId: defaultTenant.id,
                                    email: 'suporte@example.com',
                                },
                            },
                            update: {
                                passwordHash: suportePasswordHash,
                                status: 'ACTIVE',
                                name: 'Agente Suporte Demo',
                                tenantId: defaultTenant.id,
                            },
                            create: {
                                tenantId: defaultTenant.id,
                                email: 'suporte@example.com',
                                name: 'Agente Suporte Demo',
                                passwordHash: suportePasswordHash,
                                status: 'ACTIVE',
                            },
                        })];
                case 27:
                    suporteUser = _j.sent();
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
                case 28:
                    _j.sent();
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
                    scopeDefs = [
                        { code: 'identity:read', description: 'Leitura de identidade via GET /v1/integration/users/:id (RF29)' },
                        { code: 'test:scope', description: 'Escopo de teste do ScopesGuard (dev/e2e)' },
                        { code: 'read:all', description: 'Leitura total (M2M)' },
                        { code: 'write:all', description: 'Escrita total (M2M)' },
                        { code: 'orders:read', description: 'Leitura de pedidos' },
                        { code: 'orders:write', description: 'Criação/alteração de pedidos' },
                        { code: 'customers:read', description: 'Leitura de clientes (CRM)' },
                        { code: 'customers:write', description: 'Escrita de clientes (CRM)' },
                        { code: 'products:read', description: 'Leitura de produtos' },
                        { code: 'products:write', description: 'Escrita de produtos' },
                        { code: 'finance:read', description: 'Leitura fiscal/financeira (Squad 2)' },
                        { code: 'finance:write', description: 'Escrita fiscal/financeira (Squad 2)' },
                        { code: 'tickets:read', description: 'Leitura de chamados (Squad 4)' },
                        { code: 'tickets:write', description: 'Escrita de chamados (Squad 4)' },
                    ];
                    return [4 /*yield*/, Promise.all(scopeDefs.map(function (s) {
                            return prisma.scope.upsert({
                                where: { code: s.code },
                                update: { description: s.description },
                                create: { code: s.code, description: s.description },
                            });
                        }))];
                case 29:
                    scopes = _j.sent();
                    scopeByCode = new Map(scopes.map(function (s) { return [s.code, s]; }));
                    console.log("\u2705 ".concat(scopes.length, " M2M scopes upserted"));
                    console.log('✅ Seeding M2M applications:');
                    _d = 0, m2mAppDefs_1 = seed_data_1.m2mAppDefs;
                    _j.label = 30;
                case 30:
                    if (!(_d < m2mAppDefs_1.length)) return [3 /*break*/, 33];
                    def = m2mAppDefs_1[_d];
                    return [4 /*yield*/, seedM2mApplication(def, scopeByCode)];
                case 31:
                    _j.sent();
                    _j.label = 32;
                case 32:
                    _d++;
                    return [3 /*break*/, 30];
                case 33: return [4 /*yield*/, seedM2mApplication(seed_data_1.e2eM2mAppDef, scopeByCode)];
                case 34:
                    _j.sent();
                    if (!isProduction) {
                        console.log('\n📋 Local dev credentials (passwords from env or defaults in seed-data.ts):');
                        for (_e = 0, adminUserDefs_1 = seed_data_1.adminUserDefs; _e < adminUserDefs_1.length; _e++) {
                            def = adminUserDefs_1[_e];
                            console.log("   - ".concat(def.email, " \u2192 env ").concat(def.passwordEnvKey, " or ").concat(def.defaultPassword));
                        }
                        console.log("   - ".concat(seed_data_1.viewerUserDef.email, " \u2192 env ").concat(seed_data_1.viewerUserDef.passwordEnvKey, " or ").concat(seed_data_1.viewerUserDef.defaultPassword));
                        for (_f = 0, _g = __spreadArray(__spreadArray([], seed_data_1.m2mAppDefs, true), [seed_data_1.e2eM2mAppDef], false); _f < _g.length; _f++) {
                            def = _g[_f];
                            console.log("   - ".concat(def.clientId, " \u2192 env ").concat(def.secretEnvKey, " or ").concat(def.defaultSecret));
                        }
                    }
                    else {
                        console.log('\n📋 Production seed complete (credentials not logged; use cluster secrets).');
                        console.log('   Admin emails:', seed_data_1.adminUserDefs.map(function (d) { return d.email; }).join(', '));
                        console.log('   M2M client_ids:', __spreadArray(__spreadArray([], seed_data_1.m2mAppDefs, true), [seed_data_1.e2eM2mAppDef], false).map(function (d) { return d.clientId; }).join(', '));
                    }
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
