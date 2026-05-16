"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const applications_service_1 = require("./applications.service");
const prisma_service_1 = require("../../server/prisma/prisma.service");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const vitest_1 = require("vitest");
const audit_service_1 = require("../audit/audit.service");
(0, vitest_1.describe)('ApplicationsService', () => {
    let service;
    let prisma;
    (0, vitest_1.beforeEach)(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                applications_service_1.ApplicationsService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        application: {
                            create: vitest_1.vi.fn(),
                            findMany: vitest_1.vi.fn(),
                            count: vitest_1.vi.fn(),
                            findUnique: vitest_1.vi.fn(),
                            update: vitest_1.vi.fn(),
                        },
                    },
                },
                {
                    provide: audit_service_1.AuditService,
                    useValue: {
                        logStatusChange: vitest_1.vi.fn(),
                        logSecretRegenerated: vitest_1.vi.fn(),
                    },
                },
            ],
        }).compile();
        service = module.get(applications_service_1.ApplicationsService);
        prisma = module.get(prisma_service_1.PrismaService);
    });
    (0, vitest_1.it)('should be defined', () => {
        (0, vitest_1.expect)(service).toBeDefined();
    });
    (0, vitest_1.describe)('create', () => {
        (0, vitest_1.it)('should create an application returning clear client_secret', async () => {
            const createDto = { name: 'Test App' };
            const prismaMock = {
                id: '1',
                clientId: 'test-client-id',
                name: 'Test App',
                status: client_1.AppStatus.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            vitest_1.vi.spyOn(prisma.application, 'create').mockResolvedValue(prismaMock);
            const result = await service.create(createDto);
            (0, vitest_1.expect)(prisma.application.create).toHaveBeenCalled();
            (0, vitest_1.expect)(result.id).toEqual(prismaMock.id);
            (0, vitest_1.expect)(result.clientSecret).toBeDefined();
            (0, vitest_1.expect)(typeof result.clientSecret).toBe('string');
        });
        (0, vitest_1.it)('should throw ConflictException if client ID duplicates', async () => {
            vitest_1.vi.spyOn(prisma.application, 'create').mockRejectedValue(new client_1.Prisma.PrismaClientKnownRequestError('', { code: 'P2002', clientVersion: '1' }));
            await (0, vitest_1.expect)(service.create({ name: 'Test' })).rejects.toThrow(common_1.ConflictException);
        });
    });
    (0, vitest_1.describe)('findAll', () => {
        (0, vitest_1.it)('should return paginated list', async () => {
            const mockItems = [{ id: '1', name: 'App' }];
            vitest_1.vi.spyOn(prisma.application, 'findMany').mockResolvedValue(mockItems);
            vitest_1.vi.spyOn(prisma.application, 'count').mockResolvedValue(1);
            const result = await service.findAll({});
            (0, vitest_1.expect)(result.items).toEqual(mockItems);
            (0, vitest_1.expect)(result.total).toBe(1);
        });
    });
    (0, vitest_1.describe)('findOne', () => {
        (0, vitest_1.it)('should return application', async () => {
            vitest_1.vi.spyOn(prisma.application, 'findUnique').mockResolvedValue({ id: '1' });
            const result = await service.findOne('1');
            (0, vitest_1.expect)(result.id).toBe('1');
        });
        (0, vitest_1.it)('should throw NotFoundException', async () => {
            vitest_1.vi.spyOn(prisma.application, 'findUnique').mockResolvedValue(null);
            await (0, vitest_1.expect)(service.findOne('1')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    (0, vitest_1.describe)('regenerateSecret', () => {
        (0, vitest_1.it)('should update and return a new client_secret', async () => {
            const prismaMock = {
                id: '1',
                clientId: 'test-client-id',
                name: 'Test App',
                status: client_1.AppStatus.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            vitest_1.vi.spyOn(prisma.application, 'update').mockResolvedValue(prismaMock);
            const result = await service.regenerateSecret('1');
            (0, vitest_1.expect)(prisma.application.update).toHaveBeenCalled();
            (0, vitest_1.expect)(result.clientSecret).toBeDefined();
        });
        (0, vitest_1.it)('should throw NotFoundException if app not found', async () => {
            vitest_1.vi.spyOn(prisma.application, 'update').mockRejectedValue(new client_1.Prisma.PrismaClientKnownRequestError('', { code: 'P2025', clientVersion: '1' }));
            await (0, vitest_1.expect)(service.regenerateSecret('999')).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=applications.service.spec.js.map