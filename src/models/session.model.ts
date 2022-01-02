import mongoose from "mongoose"
import {userDocument} from "./user.model";

export interface sessionDocument extends mongoose.Document {
    user: userDocument['_id'],
    valid: Boolean,
    userAgent: String,
    createdAt: Date,
    updatedAt: Date,
}

const schema = mongoose.Schema;

const sessionSchema = new schema({
    user: {type: schema.Types.ObjectId, ref: "User"},
    valid: {type: Boolean, default: true},
    userAgent: {type: String}
}, {
    timestamps: true,
})

const Session = mongoose.model<sessionDocument>("Session", sessionSchema)
export default Session;