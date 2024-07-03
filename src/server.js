const app = require("./app");
const logger = require("./utils/logger");
const config = require("./utils/config");
const connectMongo = require("./db/mongo");

app.listen(config.PORT, () => {
  connectMongo();
  logger.info(`Server ready and running on port: ${config.PORT}`);
});
