const { MongoClient } = require('mongodb');
const request = require('supertest');
const { app, server } = require('../server'); // Adjust path as needed

describe('Visualizations.js tests', () => {
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

  describe('GET /get_answers', () => {
    test('should confirm specific answer object exists', async () => {
      // Assuming the data has already been inserted either in a beforeEach block or within this test
      const response = await request(app)
        .get('/get_answers')
        .expect(200)
        .expect('Content-Type', /json/);
  
      // Check if the specific object exists in the response
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _id: expect.any(String), // If _id is not predictable, use expect.any(String)
            answer1: "Extremely Helpful",
            answer2: "Very Helpful",
            answer3: "I feel like I really belong",
            answer4: "Great experience overall.",
            username: "test"
          })
        ])
      );
    });
  });
});
