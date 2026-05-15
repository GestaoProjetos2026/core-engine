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
exports.OAuthTokenRequestDto = exports.OAuthGrantType = void 0;
const class_validator_1 = require("class-validator");
var OAuthGrantType;
(function (OAuthGrantType) {
    OAuthGrantType["CLIENT_CREDENTIALS"] = "client_credentials";
    OAuthGrantType["REFRESH_TOKEN"] = "refresh_token";
})(OAuthGrantType || (exports.OAuthGrantType = OAuthGrantType = {}));
class OAuthTokenRequestDto {
    grant_type;
    client_id;
    client_secret;
    scope;
    refresh_token;
}
exports.OAuthTokenRequestDto = OAuthTokenRequestDto;
__decorate([
    (0, class_validator_1.IsEnum)(OAuthGrantType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OAuthTokenRequestDto.prototype, "grant_type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OAuthTokenRequestDto.prototype, "client_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OAuthTokenRequestDto.prototype, "client_secret", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OAuthTokenRequestDto.prototype, "scope", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OAuthTokenRequestDto.prototype, "refresh_token", void 0);
//# sourceMappingURL=oauth-token-request.dto.js.map