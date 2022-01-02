import mongoose from "mongoose";
import config from "config";
import logger from "./logger"
async function connect() {
  const dbUri = config.get<string>("dbUri");
  try {
    logger.info("database connected");
    return mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    logger.error(error);
    process.exit(1)
  }
}

export default connect;
