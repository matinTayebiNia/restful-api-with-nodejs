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
exports.deleteUserSessionHandler = exports.getUserSessionHandler = exports.createUserSessionHandler = void 0;
const user_services_1 = require("../service/user.services");
const session_sevices_1 = require("../service/session.sevices");
const jwt_utils_1 = require("../utils/jwt.utils");
const config_1 = __importDefault(require("config"));
function createUserSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //validate user's password
        const user = yield (0, user_services_1.validatePassword)(req.body);
        if (!user)
            return res.status(401).json("invalid email or password ");
        //create session
        // @ts-ignore
        const session = yield (0, session_sevices_1.createSession)(user._id, req.get("user-agent") || "");
        //create an access and refresh token
        const accessToken = (0, jwt_utils_1.signJwt)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("accessTokenTtl") });
        const refreshToken = (0, jwt_utils_1.signJwt)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("refreshTokenTtl") });
        //return access & refresh tokens
        return res.json({ accessToken, refreshToken });
    });
}
exports.createUserSessionHandler = createUserSessionHandler;
function getUserSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = res.locals.user._id;
        const session = yield (0, session_sevices_1.findSession)({ user: userID, valid: true });
        return res.json(session);
    });
}
exports.getUserSessionHandler = getUserSessionHandler;
function deleteUserSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sessionID = res.locals.user.session;
        console.log(sessionID);
        yield (0, session_sevices_1.updateSession)({ id: sessionID }, { valid: false });
        return res.json({
            accessToken: null,
            refreshToken: null
        });
    });
}
exports.deleteUserSessionHandler = deleteUserSessionHandler;
