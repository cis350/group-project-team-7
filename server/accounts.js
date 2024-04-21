const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key'; // Replace with your actual secret key

const uri = process.env.MONGO_URI || "mongodb+srv://lionness267:k9xjz57yzuZWIrun@cluster0.yze8rsn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log("URI: ", uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let MongoConnection;

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const connect = async () => {
  try {
    MongoConnection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`connected to db: ${MongoConnection.db().databaseName}`);
    return MongoConnection;
  } catch (err) {
    console.log(err.message);
  }
};

const getDB = async () => {
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

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
    const token = generateToken({ username });
    res.status(201).json({ token });
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
    res.status(401).send('Invalid credentials');
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
    res.status(400).send('User does not exist');
  }
};

const getUserInfo = async (req, res) => {
  const db = await getDB();
  const username = req.query?.username ?? undefined;

  const exists = await db.collection('users').findOne({ username: username });
  if (exists) {
    res.status(200).send(exists);
  } else {
    res.status(400).send('User does not exist');
  }
};

const getCurrentUser = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || '';
  const decoded = verifyToken(token);

  if (decoded) {
    res.status(200).json({ username: decoded.username });
  } else {
    res.status(401).send('Unauthorized');
  }
};

const logoutAccount = async (req, res) => {
  req.session.destroy();
  res.send('Logged out');
};

const createAnswers = async (req, res) => {
  const db = await getDB();
  const { username, answer1, answer2, answer3, answer4 } = req.body;

  const newAnswer = {
    username: username,
    answer1: answer1,
    answer2: answer2,
    answer3: answer3,
    answer4: answer4,
  };

  const result = await db.collection('answers').insertOne(newAnswer);
  if (result.insertedCount === 1) {
    res.status(201).send('New answer entry created');
  } else {
    res.status(400).send('Failed to create answer entry');
  }
};



module.exports = {
  closeMongoDBConnection,
  getDB,
  connect,
  signupAccount,
  getCurrentUser,
  loginAccount,
  logoutAccount,
  getUserInfo,
  updateProfilePicture,
  createAnswers
};
