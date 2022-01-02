import {DocumentDefinition, FilterQuery} from "mongoose";
import {userDocument} from "../models/user.model";
import User from "../models/user.model"
import {omit} from "lodash"

export async function createUser(input: DocumentDefinition<Omit<userDocument, "createdAt" | "updatedAt" | "comparePassword">>) {
    try {
        const user = await User.create(input)
        return omit(user.toJSON(), "password")

    } catch (e: any) {
        throw new Error(e)
    }
}


export async function validatePassword({email, password}: { email: String, password: String }) {

    const user = await User.findOne({email})

    if (!user) return false;

    const isValid = user.comparePassword(password)

    if (!isValid) return false;

    return omit(user.toJSON(), "password")

}


export async function findUser(query:FilterQuery<userDocument>) {
    return omit(User.findOne(query).lean(),"password")
}