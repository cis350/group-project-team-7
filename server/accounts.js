const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');


// the mongodb server URL
// const dbURL = "mongodb://localhost:27017/users";

const uri = process.env.MONGO_URI || "mongodb+srv://lionness267:k9xjz57yzuZWIrun@cluster0.yze8rsn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log("URI: ", uri);

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

const signupAccount = async (req, res) => {
  const db = await getDB();
  const username = req.query?.username ?? undefined;
  const password = req.query?.password ?? undefined;

  const newUser = {
    username: username,
    password: password,
    profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
  };

  const exists = await db.collection('users').findOne({ username: username });
  if (exists) {
    res.status(400).send('Username already exists');
  } else {
    const result = await db.collection('users').insertOne(newUser);
    req.session.username = username;
    req.session.save();
    res.status(201).send(result.insertedId);
  }
};

const loginAccount = async (req, res) => {
  const db = await getDB();
  const username = req.query?.username ?? undefined;
  const password = req.query?.password ?? undefined;

  const exists = await db.collection('users').findOne({ username: username });
  if (exists) {
    //Check password
    if (exists.password === password) {
      req.session.username = username;
      req.session.save();
      res.status(200).send({ id: exists._id, username: exists.username });
    } else {
      res.status(400).send('Incorrect password');
    }
  } else {
    res.status(400).send('Username does not exist')
  }
};

const updateProfilePicture = async (req, res) => {
  const db = await getDB();
  const username = req.query?.username ?? undefined;
  const profilePicture = req.query?.profilePicture ?? undefined;

  const exists = await db.collection('users').updateOne({ username: username }, { $set: { profilePicture: profilePicture } })
  if (exists.modifiedCount > 0) {
    res.status(201).send('Profile picture updated')
  } else {
    res.status(400).send('User does not exist')
  }
};


const getUserInfo = async (req, res) => {
  const db = await getDB();
  const username = req.query?.username ?? undefined;

  const exists = await db.collection('users').findOne({ username: username });
  if (exists) {
    res.status(200).send(exists)
  } else {
    res.status(400).send('User does not exist')
  }
};

const getCurrentUser = async (req, res) => {
  const username = req.session.username ?? "";
  res.send(username);
}

const logoutAccount = async (req, res) => {
  req.session.destroy();
  res.send('Logged out');
}


//get user info
//get current user

// export the functions
module.exports = {
  closeMongoDBConnection,
  getDB,
  connect,
  signupAccount,
  getCurrentUser,
  loginAccount,
  logoutAccount,
  getUserInfo,
  updateProfilePicture
};