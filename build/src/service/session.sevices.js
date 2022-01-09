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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reIssueAccessToken = exports.updateSession = exports.findSession = exports.createSession = void 0;
const session_model_1 = __importDefault(require("../models/session.model"));
const jwt_utils_1 = require("../utils/jwt.utils");
const lodash_1 = require("lodash");
const user_services_1 = require("./user.services");
const config_1 = __importDefault(require("config"));
function createSession(userID, userAgent) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield session_model_1.default.create({ user: userID, userAgent });
        return session.toJSON();
    });
}
exports.createSession = createSession;
function findSession(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return session_model_1.default.find(query).lean();
    });
}
exports.findSession = findSession;
function updateSession(query, update) {
    return __awaiter(this, void 0, void 0, function* () {
        return session_model_1.default.updateOne(query, update);
    });
}
exports.updateSession = updateSession;
function reIssueAccessToken({ refreshToken }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { decode } = (0, jwt_utils_1.verifyJwt)(refreshToken);
        if (!decode || !(0, lodash_1.get)(decode, "session"))
            return false;
        const session = yield session_model_1.default.findById((0, lodash_1.get)(decode, "session"));
        if (!session || !session.valid)
            return false;
        const user = yield (0, user_services_1.findUser)({ _id: session.user });
        if (!user)
            return false;
        return (0, jwt_utils_1.signJwt)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("refreshTokenTtl") });
    });
}
exports.reIssueAccessToken = reIssueAccessToken;
