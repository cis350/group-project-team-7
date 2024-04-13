const express = require('express');
const cors = require('cors');
const config = require('./config');
const accounts = require('./accounts');
const session = require('express-session');

// Express is used to define API endpoints
const app = express(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
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

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
