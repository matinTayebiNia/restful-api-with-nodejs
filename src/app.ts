import express from "express";
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserializerUser from "./middleware/deserializeUser";

const port = config.get<number>("port");
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(deserializerUser)

app.listen(port, async () => {
    logger.info(`server is running on port ${port}`);
    await connect();
    routes(app);
});
