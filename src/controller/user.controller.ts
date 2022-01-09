import {Request, Response} from "express";
import logger from "../utils/logger"
import {createUser} from "../service/user.services"
import {createUserInput} from "../schema/user.schema";
import {omit} from "lodash"

export async function createUserHandler(req: Request<{}, {}, createUserInput["body"]>, res: Response) {
    try {
        const user = await createUser(req.body)
        // @ts-ignore
        return res.json(omit(user, "password"))
    } catch (e: any) {
        logger.error(e.message)
        return res.status(409).send(e.message)
    }
}

