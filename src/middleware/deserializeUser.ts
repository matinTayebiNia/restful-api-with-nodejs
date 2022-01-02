import {Request, Response, NextFunction} from "express";
import {get} from "lodash"
import {verifyJwt} from "../utils/jwt.utils";
import {reIssueAccessToken} from "../service/session.sevices";

const deserializerUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "headers.authentication", "").replace(/^Bearar\s/, "")
    const refreshToken = get(req, "headers.x-refresh")
    if (!accessToken) return next();

    const {decode, expired} = verifyJwt(accessToken)

    if (decode) {
        res.locals.user = decode
        return next()
    }

    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({refreshToken})
        if (newAccessToken) {
            res.setHeader("authentication", newAccessToken)
            const result = verifyJwt(newAccessToken)
            res.locals.user = result.decode
            return next()
        }
    }
    return next()
}


export default deserializerUser;