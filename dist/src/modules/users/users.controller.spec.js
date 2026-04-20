"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_controller_1 = require("./users.controller");
const client_1 = require("@prisma/client");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('UsersController', () => {
    let controller;
    let service;
    const mockUsersService = {
        create: vitest_1.vi.fn(),
        findAll: vitest_1.vi.fn(),
        findOne: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        changeStatus: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        service = mockUsersService;
        controller = new users_controller_1.UsersController(service);
    });
    (0, vitest_1.it)('should create a user', async () => {
        mockUsersService.create.mockResolvedValue({ id: '1', email: 'test@test.com' });
        const result = await controller.create({ email: 'test@test.com', name: 'Test', password: 'Password123' });
        (0, vitest_1.expect)(result).toEqual({ id: '1', email: 'test@test.com' });
        (0, vitest_1.expect)(service.create).toHaveBeenCalled();
    });
    (0, vitest_1.it)('should find all users', async () => {
        mockUsersService.findAll.mockResolvedValue({ items: [], total: 0, page: 1, limit: 10 });
        const result = await controller.findAll({ page: 1, limit: 10 });
        (0, vitest_1.expect)(result).toEqual({ items: [], total: 0, page: 1, limit: 10 });
        (0, vitest_1.expect)(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
    (0, vitest_1.it)('should find one user', async () => {
        mockUsersService.findOne.mockResolvedValue({ id: '1', email: 'test@test.com' });
        const result = await controller.findOne('1');
        (0, vitest_1.expect)(result).toEqual({ id: '1', email: 'test@test.com' });
    });
    (0, vitest_1.it)('should change user status', async () => {
        mockUsersService.changeStatus.mockResolvedValue({ id: '1', status: 'INACTIVE' });
        const result = await controller.changeStatus('1', { status: client_1.UserStatus.INACTIVE });
        (0, vitest_1.expect)(result).toEqual({ id: '1', status: 'INACTIVE' });
    });
});
//# sourceMappingURL=users.controller.spec.js.map