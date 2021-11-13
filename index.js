require("dotenv").config();
const { initializeServer } = require("./server/index");
const initializeMongoDBServer = require("./database/index");

const port = process.env.PORT || process.env.LOCAL_PORT || 5050;

(async () => {
  await initializeServer(port);
  await initializeMongoDBServer(process.env.MONGODB_STRING);
})();
