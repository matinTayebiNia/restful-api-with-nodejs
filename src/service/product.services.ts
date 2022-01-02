import Product, {productDocument} from "../models/product.model";
import {DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery} from "mongoose";
import {sessionDocument} from "../models/session.model";

export async function createProduct(
    input: DocumentDefinition<Omit<productDocument, "createdAt" | "updatedAt">>
) {
    return Product.create(input)
}

export async function findProduct(
    query: FilterQuery<productDocument>,
    options: QueryOptions = {lean: true}) {
    return Product.findOne(query, {}, options);

}

export async function findAndUpdateProduct(
    query: FilterQuery<productDocument>,
    update: UpdateQuery<productDocument>,
    options: QueryOptions = {lean: true}) {
    return Product.findOneAndUpdate(query, update, options)
}

export async function deleteProduct(query: FilterQuery<productDocument>,) {
    return Product.deleteOne(query)
}