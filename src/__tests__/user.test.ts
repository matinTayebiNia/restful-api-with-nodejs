import supertest from "supertest";
import createServer from "../utils/server";
import mongoose from "mongoose";
import * as userService from "../service/user.services"
import * as sessionService from "../service/session.sevices"
import {createUserSessionHandler} from "../controller/session.controller";

const app = createServer();
const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
    _id: userId,
    email: "foo@gmail.com",
    name: "matin"
}

const userInput = {
    name: "matin",
    email: "foo@gmail.com",
    password: "matin321Q",
    passwordConfirmation: "matin321Q"
}

const sessionPayload = {
    _id: new mongoose.Types.ObjectId().toString(),
    user: userId,
    valid: true,
    userAgent: "PostmanRuntime/7.28.4",
    createdAt: new Date("2022-01-07T08:51:23.182Z"),
    updatedAt: new Date("2022-01-07T08:51:23.182Z"),
    __v: 0
}


describe("user", () => {
    //user registration
    describe("user registration ", () => {
        describe("given username and password are valid", () => {
            it('should return user payload ', async function () {
                // @ts-ignore
                const createUserServiceMock = jest.spyOn(userService, "createUser").mockReturnValueOnce(userPayload)

                const {statusCode, body} = await supertest(app).post("/api/users").send(userInput)

                expect(statusCode).toBe(200);

                expect(body).toEqual(userPayload)

                expect(createUserServiceMock).toHaveBeenCalledWith(userInput)

            });
        })
        describe("given  passwords do not match", () => {
            it('should return a 400  ', async function () {
                // @ts-ignore
                const createUserServiceMock = jest.spyOn(userService, "createUser").mockReturnValueOnce(userPayload)
                const {statusCode} = await supertest(app).post("/api/users").send({
                    ...userInput,
                    passwordConfirmation: "password Dose not match"
                })

                expect(statusCode).toBe(400);
                expect(createUserServiceMock).not.toHaveBeenCalled()
            });
        })
        describe("given the user service throws", () => {
            it('should return a 409 error', async function () {
                // @ts-ignore
                const createUserServiceMock = jest
                    .spyOn(userService, "createUser")
                    .mockRejectedValueOnce("Oh no :(")

                const {statusCode} = await supertest(app).post("/api/users").send(userInput)

                expect(statusCode).toBe(409);
                expect(createUserServiceMock).toHaveBeenCalled()
            });
        })
    })
    //user sessions
    describe("create user session", () => {
        describe("given username and password are valid ", () => {
            it('should return a signed access token and refresh token', async function () {
                // @ts-ignore
                jest.spyOn(userService, "validatePassword").mockReturnValue(userPayload)
                // @ts-ignore
                jest.spyOn(sessionService, "createSession").mockReturnValue(sessionPayload)

                const req = {
                    get: () => {
                        return "a user agent"
                    },
                    body: {
                        email: "test@gmail.com",
                        password: "test12345"
                    }
                }

                const json = jest.fn()

                const res = {
                    json
                }
                // @ts-ignore
                await createUserSessionHandler(req, res)

                expect(json).toHaveBeenCalledWith({
                    accessToken: expect.any(String),
                    refreshToken: expect.any(String)
                })
            });
        })
    })
})