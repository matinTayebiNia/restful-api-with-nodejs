import {Request, Response} from "express";
import {validatePassword} from "../service/user.services";
import {createSession, findSession, updateSession} from "../service/session.sevices";
import {signJwt} from "../utils/jwt.utils";
import config from "config"

export async function createUserSessionHandler(req: Request, res: Response) {

    //validate user's password

    const user = await validatePassword(req.body)
    if (!user) return res.status(401).json("invalid email or password ")


    //create session
    // @ts-ignore
    const session = await createSession(user._id, req.get("user-agent") || "")

    //create an access and refresh token

    const accessToken =
        signJwt({...user, session: session._id,},
            {expiresIn: config.get<string>("accessTokenTtl")})

    const refreshToken =
        signJwt({...user, session: session._id,},
            {expiresIn: config.get<string>("refreshTokenTtl")})

    //return access & refresh tokens
    return res.json({accessToken, refreshToken})
}

export async function getUserSessionHandler(req: Request, res: Response) {
    const userID = res.locals.user._id

    const session = await findSession({user: userID, valid: true})
    return res.json(session)
}

export async function deleteUserSessionHandler(req: Request, res: Response) {
    const sessionID = res.locals.user.session;
    console.log(sessionID)
    await updateSession({id: sessionID}, {valid: false})

    return res.json({
        accessToken: null,
        refreshToken: null
    })
}