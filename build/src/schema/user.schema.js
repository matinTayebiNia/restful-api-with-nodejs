"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "name is required"
        }),
        password: (0, zod_1.string)({
            required_error: "password is required",
        }).min(8, "password is to short - should be 8 character"),
        passwordConfirmation: (0, zod_1.string)({
            required_error: "passwordConfirmation is required"
        }),
        email: (0, zod_1.string)({
            required_error: "email is required"
        }).email("not a valid email")
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "passwords do not match",
        path: ["passwordConfirmation"]
    })
});
