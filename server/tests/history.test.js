const { MongoClient } = require('mongodb');
const request = require('supertest');
const session = require('express-session');
const { app, server } = require('../server'); // Adjust path as needed

// Configure session middleware correctly
app.use(session({
    secret: 'test secret',
    resave: false,
    saveUninitialized: true
}));

describe('History.js tests', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    console.log('Database connected for testing');
  });

  afterAll(async () => {
    await connection.close();
    console.log('Database connection closed');
    server.close(); // Properly close the server after all tests
  });

  beforeEach(async () => {
    await db.collection('answers').deleteMany({});
    const count = await db.collection('answers').countDocuments();
    console.log(`Records in 'answers' collection after cleanup: ${count}`);
    expect(count).toBe(0); // Ensure that the database is empty
  });

  describe('GET /get_user_answers?username=${username}', () => {
    test('should confirm specific answer object exists', async () => {
      const agent = request.agent(app);
      // Middleware to simulate session with username 'test'
      app.use((req, res, next) => {
        req.session.user = '';
        next();
      });

      await db.collection('answers').insertOne({
        username: '',
        answer1: "Very Helpful",
        answer2: "Very Helpful",
        answer3: "I feel like I don't belong much",
        answer4: "ahasjkdfnajs"
      });

      const response = await agent
        .get(`/get_user_answers?username=''`)
        .expect(200)
        .expect('Content-Type', /json/);
  
      // Check if the specific object exists in the response
      const hasNonEmptyAnswers = response.body.some(entry => entry.answer1 || entry.answer2 || entry.answer3 || entry.answer4);
      expect(hasNonEmptyAnswers).toBeTruthy();
    });
  });
});
