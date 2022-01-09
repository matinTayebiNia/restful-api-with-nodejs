"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const jwt_utils_1 = require("../utils/jwt.utils");
const session_sevices_1 = require("../service/session.sevices");
const deserializerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (0, lodash_1.get)(req, "headers.authentication", "").replace(/^Bearar\s/, "");
    const refreshToken = (0, lodash_1.get)(req, "headers.x-refresh");
    if (!accessToken)
        return next();
    const { decode, expired } = (0, jwt_utils_1.verifyJwt)(accessToken);
    if (decode) {
        res.locals.user = decode;
        return next();
    }
    if (expired && refreshToken) {
        const newAccessToken = yield (0, session_sevices_1.reIssueAccessToken)({ refreshToken });
        if (newAccessToken) {
            res.setHeader("authentication", newAccessToken);
            const result = (0, jwt_utils_1.verifyJwt)(newAccessToken);
            res.locals.user = result.decode;
            return next();
        }
    }
    return next();
});
exports.default = deserializerUser;
