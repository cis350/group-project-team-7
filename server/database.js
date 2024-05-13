const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');


// the mongodb server URL
// const dbURL = "mongodb://localhost:27017/users";

const uri = "mongodb+srv://lionness267:k9xjz57yzuZWIrun@cluster0.yze8rsn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/**
 * MongoDB database connection
 * It will be exported so we can close the connection
 * after running our tests
 */
let MongoConnection;
// connection to the db
const connect = async () => {
  // always use try/catch to handle any exception
  try {
    MongoConnection = (await MongoClient.connect(
      uri,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )); // we return the entire connection, not just the DB
    console.log(`connected to db: ${MongoConnection.db().databaseName}`);
    return MongoConnection;
  } catch (err) {
    console.log(err.message);
  }
};

/**
 *
 * @returns the database attached to this MongoDB connection
 */
const getDB = async () => {
  // test if there is an active connection
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

/**
 *
 * Close the mongodb connection
 */
const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

/**
 * Function that adds object to 'answer' database
 */
const addAnswer = async (answer) => {
  const db = await getDB();
  const result = await db.collection('answers').insertOne(answer);
  return result.insertedId;
}

/**
 * Function that adds object to 'users' database
 */
const addUser = async (answer) => {
    const db = await getDB();
    const result = await db.collection('users').insertOne(answer);
    return result.insertedId;
  }

/**
 * Get user information
 * @param {Request} req
 * @param {Response} res
 */
const getUserInfoDb = async (username) => {
    const db = await getDB();
  
    const exists = await db.collection('users').findOne({ username: username });
    return exists;
  };

/**
 * Get all answers from the database
 * @param {Request} req
 * @param {Response} res
 */
const getAllAnswersDb = async () => {
    // console.log(req.session.username, "sess user");
  
    const db = await getDB();
    const answers = await db.collection('answers').find({}).toArray();
    return answers;
  }

/**
 * Get answers from the database for the current user
 * @param {Request} req
 * @param {Response} res
 */
const getAnswersDb = async (user) => {  
    const db = await getDB();
    console.log(user, "curr user")
    const answers = await db.collection('answers').find({ username: user }).toArray();
    return answers;
  }

/**
 * Delete an answer from the database
 * @param {Request} req
 * @param {Response} res
 */
const deleteAnswerDb = async (_id) => {
    const db = await getDB();
    const answers = await db.collection('answers').deleteOne({
      _id: new ObjectId(_id)
    });
    return answers;
  }

module.exports = {
  closeMongoDBConnection,
  getDB,
  connect,
  addAnswer,
  getUserInfoDb,
  addUser,
  getAllAnswersDb,
  getAnswersDb,
  deleteAnswerDb
};
