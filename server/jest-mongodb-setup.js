const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();

  // Global reference to avoid multiple instances in watch mode
  global.__MONGOSERVER__ = mongoServer;
};
