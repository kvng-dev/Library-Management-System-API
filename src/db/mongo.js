const mongoose = require("mongoose");
const logger = require("../utils/logger");
const config = require("../utils/config");

const connectMongo = async () => {
  try {
    logger.info("Connecting to Mongo Database, Please Wait...");
    const connectDb = await mongoose.connect(config.MONGODB_URI);
    logger.info(
      `Mongo Database connected Successfully on: ${connectDb.connection.host}`
    );
  } catch (error) {
    logger.error(`Error connecting to Mongo Database: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectMongo;
