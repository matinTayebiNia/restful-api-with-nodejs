import {Express, Request, Response} from "express";

//controllers
import {createUserHandler} from "./controller/user.controller"
import {
    createUserSessionHandler,
    deleteUserSessionHandler,
    getUserSessionHandler
} from "./controller/session.controller";
import {
    createProductHandler,
    deleteProductHandler,
    getProductHandler,
    updateProductHandler
} from "./controller/product.controller";


//validations
import {createUserSchema} from "./schema/user.schema";
import {createSessionSchema} from "./schema/session.schema";

//middleware
import validate from "./middleware/validateResource";
import requireUser from "./middleware/requireUser";
import {createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema} from "./schema/product.schema";

function routes(app: Express) {
    app.get("/test", (req: Request, res: Response) => {
        return res.json("this is a test");
    });
    app.post("/api/users", validate(createUserSchema), createUserHandler)
    app.post("/api/sessions", validate(createSessionSchema), createUserSessionHandler)
    app.get("/api/sessions", requireUser, getUserSessionHandler)
    app.delete("/api/sessions", requireUser, deleteUserSessionHandler)
    app.post("/api/createProduct", [requireUser, validate(createProductSchema)], createProductHandler)
    app.put("/api/updateProduct/:productId", [requireUser, validate(updateProductSchema)], updateProductHandler)
    app.get("/api/getProduct/:productId", validate(getProductSchema), getProductHandler)
    app.delete("/api/deleteProduct/:productId", [requireUser, validate(deleteProductSchema)], deleteProductHandler)
}

export default routes;
