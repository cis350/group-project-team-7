const express = require('express');
const cors = require('cors');
const accounts = require('./accounts');
const session = require('express-session');
require('dotenv').config({ path: '.env' });

const serverHost = process.env.SERVER_HOST;
const serverPort = process.env.SERVER_PORT;

// Express is used to define API endpoints
const app = express(express.json());

const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));

app.get('/', (req, res) => {
  res.json({ message: 'CORS API endpoint test' });
});

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
app.post('/update_answer', accounts.createAnswers);


const server = app.listen(serverPort, () => {
  console.log(
    `Server running at http://${serverHost}:${serverPort}/`
  );
});

module.exports = { app, server };
