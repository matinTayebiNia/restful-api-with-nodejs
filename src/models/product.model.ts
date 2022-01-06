import mongoose from "mongoose"
import {customAlphabet} from "nanoid"
import {userDocument} from "./user.model";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10)

export interface productInput {
    user: userDocument['_id'],
    title: String,
    description: String,
    price: number,
    image: String,
}

export interface productDocument extends productInput, mongoose.Document {
    user: userDocument['_id'],
    title: String,
    description: String,
    price: number,
    image: String,
    createdAt: Date,
    updatedAt: Date,
}

const schema = mongoose.Schema;


const ProductSchema = new schema({
    productId: {
        type: String,
        required: true,
        unique: true,
        default: () => `product_${nanoid()}`
    },
    user: {type: schema.Types.ObjectId, ref: "User"},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true}
}, {
    timestamps: true
})


const Product = mongoose.model<productDocument>("Product", ProductSchema)

export default Product;