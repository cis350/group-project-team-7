// module for managing the session

// Save user to session given session and username
const saveUserToSession = (session, username) => {
  session.username = username;
    session.save(err => {
    if (err) {
        return res.status(500).send('Session save failed.');
    }
  });
};

// destory session
const destroySession = (session) => {
  session.destroy();
};

// get user from session
const getUserFromSession = (session) => {
  return session.username;
};

module.exports = {
    saveUserToSession,
    destroySession,
    getUserFromSession
  };