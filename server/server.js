const express = require('express');
const cors = require('cors');
const accounts = require('./accounts');
const session = require('express-session');
require('dotenv').config({ path: '.env' });

const serverHost = process.env.SERVER_HOST;
const serverPort = process.env.SERVER_PORT;

// Express is used to define API endpoints
const app = express(express.json());

const whitelist = ['http://localhost:3000', 'https://group-project-team-7-3yebnl906-kriyips-projects.vercel.app'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(
  cors(corsOptions),
);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'loginSecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use(express.json({
  type: ['application/json', 'text/plain'],
}));

// Each of our endpoints used to query our database

app.post('/signup', accounts.signupAccount);
app.get('/get_current_user', accounts.getCurrentUser);
app.get('/get_user_info', accounts.getUserInfo);
app.post('/login', accounts.loginAccount);
app.post('/logout', accounts.logoutAccount);
app.post('/update_profile_picture', accounts.updateProfilePicture);

app.listen(serverPort, () => {
  console.log(
    `Server running at http://${serverHost}:${serverPort}/`
  );
});

module.exports = app;
