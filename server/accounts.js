// import mongo from database.js
const { getDB, closeMongoDBConnection, connect, addAnswer, getUserInfoDb, addUser } = require('./database');
// import session from session.js
const { saveUserToSession, destroySession, getUserFromSession } = require('./session');

/**
 * Create a new account
 * @param {Request} req
 * @param {Response} res
 */
const signupAccount = async (req, res) => {
  const username = req.query?.username ?? undefined;
  const password = req.query?.password ?? undefined;

  const newUser = {
    username: username,
    password: password,
    profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
  };

  const exists = await getUserInfoDb(username);
  if (exists) {
    res.status(400).send('Username already exists');
  } else {
    const result = await addUser(newUser);
    // req.session.username = username;
    // req.session.save();
    saveUserToSession(req.session, username);
    res.status(201).send(result.insertedId);
  }
};

/**
 * Login to an existing account
 * @param {Request} req
 * @param {Response} res
 */
const loginAccount = async (req, res) => {
  const username = req.query?.username ?? undefined;
  const password = req.query?.password ?? undefined;

  const exists = await getUserInfoDb(username);
  if (exists) {
    //Check password
    if (exists.password === password) {
      //   req.session.username = username;
      //   req.session.save();
      saveUserToSession(req.session, username);
      res.status(201).send(exists);
    } else {
      res.status(400).send('Incorrect password');
    }
  } else {
    res.status(400).send('Username does not exist')
  }
};

/**
 * Update profile picture
 * @param {Request} req
 * @param {Response} res
 */
// const updateProfilePicture = async (req, res) => {
//   const db = await getDB();
//   const username = req.query?.username ?? undefined;
//   const profilePicture = req.query?.profilePicture ?? undefined;

//   const exists = await db.collection('users').updateOne({ username: username }, { $set: { profilePicture: profilePicture } })
//   if (exists) {
//     res.status(201).send('Profile picture updated')
//   } else {
//     res.status(400).send('User does not exist')
//   }
// };

/**
 * Get user information
 * @param {Request} req
 * @param {Response} res
 */
const getUserInfo = async (req, res) => {
  const username = req.query?.username ?? undefined;
  getUserInfoDb(username).then((data) => {
    if (data) {
      res.status(200).send(data)
    } else {
      res.status(400).send('User does not exist')
    }
  });
};

/**
 * Get current user
 * @param {Request} req
 * @param {Response} res
 */
const getCurrentUser = async (req, res) => {
  //   const username = req.session.username ?? "";
  const username = getUserFromSession(req.session) ?? "";
  res.send(username);
}

/**
 * Logout of current account and destoys session
 */
const logoutAccount = async (req, res) => {
  //   req.session.destroy();
  // destory the session
  destroySession(req.session);
  res.send('Logged out');
}

/**
 * Given answers to the form, creates a new answer and adds it to the database
 * @param {Request} req
 * @param {Response} res
 */
const createAnswers = async (req, res) => {
  //   const username = req.session.username ?? "";
  const username = getUserFromSession(req.session) ?? "";
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
  // ask database module to add to the database
  const insId = await addAnswer(newAnswer);
  res.status(201).send(insId);
};

const getAllAnswers = async (req, res) => {
  const db = await getDB();
  const answers = await db.collection('answers').find({}).toArray();
  res.status(200).send(answers);
}

const getAnswers = async (req, res) => {
  const db = await getDB();
  const user = getUserFromSession(req.session) ?? "";
  const answers = await db.collection('answers').find({ username: user }).toArray();
  res.status(200).send(answers);
}


module.exports = {
  closeMongoDBConnection,
  getDB,
  connect,
  signupAccount,
  getCurrentUser,
  loginAccount,
  logoutAccount,
  getUserInfo,
  //   updateProfilePicture,
  createAnswers,
  getAllAnswers,
  getAnswers
};
