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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListApplicationsQueryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
class ListApplicationsQueryDto {
    page;
    limit;
    name;
    status;
}
exports.ListApplicationsQueryDto = ListApplicationsQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Página atual', default: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListApplicationsQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Itens por página', default: 10 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ListApplicationsQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Filtrar por nome' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListApplicationsQueryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AppStatus, required: false, description: 'Filtrar por status' }),
    (0, class_validator_1.IsEnum)(client_1.AppStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof client_1.AppStatus !== "undefined" && client_1.AppStatus) === "function" ? _a : Object)
], ListApplicationsQueryDto.prototype, "status", void 0);
//# sourceMappingURL=list-applications-query.dto.js.map