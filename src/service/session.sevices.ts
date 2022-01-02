import Session, {sessionDocument} from "../models/session.model"
import {FilterQuery} from "mongoose";
import {signJwt, verifyJwt} from "../utils/jwt.utils";
import {get} from "lodash"
import {findUser} from "./user.services";
import config from "config";

export async function createSession(userID: String, userAgent: String) {
    const session = await Session.create({user: userID, userAgent})
    return session.toJSON();
}

export async function findSession(query: FilterQuery<sessionDocument>) {
    return Session.find(query).lean();
}

export async function updateSession(
    query: FilterQuery<sessionDocument>,
    update: FilterQuery<sessionDocument>) {
    return Session.updateOne(query, update);
}

export async function reIssueAccessToken({refreshToken}: { refreshToken: String }) {

    const {decode} = verifyJwt(refreshToken)

    if (!decode || !get(decode, "session")) return false;

    const session = await Session.findById(get(decode, "session"));
    if (!session || !session.valid) return false;

    const user = await findUser({_id: session.user})
    if (!user) return false;

    return signJwt({...user, session: session._id,},
        {expiresIn: config.get<string>("refreshTokenTtl")})
}