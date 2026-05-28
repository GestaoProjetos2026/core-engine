"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        const pool = new pg_1.Pool(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : undefined);
        let schema = 'core_engine';
        if (process.env.DATABASE_URL) {
            try {
                const url = new URL(process.env.DATABASE_URL);
                schema = url.searchParams.get('schema') || 'core_engine';
            }
            catch (e) { }
        }
        const adapter = new adapter_pg_1.PrismaPg(pool, { schema });
        super({ adapter });
    }
    async onModuleInit() {
        if (!process.env.DATABASE_URL)
            return;
        await this.$connect();
    }
    async onModuleDestroy() {
        if (!process.env.DATABASE_URL)
            return;
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map