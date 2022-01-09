import express from "express";
import deserializerUser from "../middleware/deserializeUser";
import routes from "../routes";

function createServer() {
    const app = express();
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use(deserializerUser)
    routes(app);
    return app;
}


export default createServer