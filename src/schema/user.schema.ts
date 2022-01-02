import {object, string, TypeOf,} from "zod"

export const createUserSchema = object({
    body: object({
        name: string({
            required_error: "name is required"
        }),
        password: string({
            required_error: "password is required",
        }).min(8, "password is to short - should be 8 character"),
        passwordConfirmation: string({
            required_error: "passwordConfirmation is required"
        }),
        email: string({
            required_error: "email is required"
        }).email("not a valid email")
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "passwords do not match",
        path: ["passwordConfirmation"]
    })
})
export type createUserInput = Omit<TypeOf<typeof createUserSchema>,
    "body.passwordConfirmation">;