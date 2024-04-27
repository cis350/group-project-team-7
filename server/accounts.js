// import mongo from database.js
const { getDB, closeMongoDBConnection, connect } = require('./database');

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
      res.status(201).send(exists);
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
  if (exists) {
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

const createAnswers = async (req, res) => {
  const db = await getDB();
  const username = req.session.username ?? "";
  const answer1 = req.query?.answer1 ?? undefined;
  const answer2 = req.query?.answer2 ?? undefined;
  const answer3 = req.query?.answer3 ?? undefined;
  const answer4 = req.query?.answer4 ?? undefined;

  const newAnswer = {
    username: username,
    answer1: answer1,
    answer2: answer2,
    answer3: answer3,
    answer4: answer4,
  };

  const result = await db.collection('answers').insertOne(newAnswer);
  res.status(201).send(result.insertedId);
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
