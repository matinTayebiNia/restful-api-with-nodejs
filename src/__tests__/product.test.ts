import supertest from "supertest";
import createServer from "../utils/server";
import mongoose from "mongoose";
import config from "config"
import {createProduct} from "../service/product.services";
import {signJwt} from "../utils/jwt.utils";

const app = createServer()
const userId = new mongoose.Types.ObjectId().toString();
const productPayload = {
    user: userId,
    title: "this is title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    price: 2000,
    image: "https://i.picsum.photos/id/429/200/200.jpg?hmac=9FwQwE20mRBTbcAmKXOhnDdpvTgru3vSGriKkpK0kI4"
}
const userPayload = {
    _id: userId,
    email: "matintayebinia@gmail.com",
    name: "matin"
}


describe("product", () => {
    beforeAll(async () => {
        await mongoose.connect(config.get<string>("dbUri"))
    })
    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close();
    })
    describe("get product route", () => {
        describe("given product does not exist", () => {
            it('should return a 404  ', async () => {
                const productId = "product-123"
                await supertest(app).get(`/api/getProduct/${productId}`).expect(404);
            });
        })
        describe("given product does  exist", () => {
            it('should return a 200 status with product created message  ', async () => {
                const product = await createProduct(productPayload)

                const {statusCode} = await supertest(app).get(`/api/getProduct/${product.productId}`);

                expect(statusCode).toBe(200)
            });
        })
    })
    describe("create product route", () => {
        describe("given the user is not logged in", () => {
            it('should return a 403', async () => {
                await supertest(app).post("/api/createProduct",).expect(403);
            });
        })
        describe("given the user is logged in", () => {
            it('should return a 200 and create product ', async () => {

                const jwt = signJwt(userPayload)


                const {statusCode} = await supertest(app).post("/api/createProduct")
                    .set("authentication", jwt)
                    .send(productPayload);


                expect(statusCode).toBe(200)
            });
        })
    })
})