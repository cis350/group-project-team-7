const { MongoClient } = require('mongodb');
const request = require('supertest');
const app = require('../server'); // Adjust path as needed


describe('GET / (test message)', () => {
  test('should return a test message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'CORS API endpoint test' });
  }, 10000);
});


describe('Accounts.js tests', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  afterAll(async () => {
    console.log(await db.collection('users').find({}).toArray());
    await connection.close();
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
    // print everything in the collection
  });

  describe('Signup', () => {
    test('returns 201 for new user', async () => {
      const response = await request(app)
        .post('/signup')
        .query({ username: "uniqueUsername", password: 'pass123' });
      expect(response.statusCode).toBe(201);
    });

    test('returns 400 for duplicate user', async () => {
      // First create a user
      await db.collection('users').insertOne({ username: 'existingUser', password: 'pass123' });

      // Attempt to create the same user again
      const response = await request(app)
        .post('/signup')
        .query({ username: 'existingUser', password: 'pass123' });
      expect(response.statusCode).toBe(400);
    });
  });

  describe('Login', () => {
    test('Login existing user and return 200', async () => {
      // create a user
      await db.collection('users').insertOne({ username: 'user', password: 'password', _id: 'user_id' });

      const response = await request(app)
        .post('/login')
        .query({ username: 'user', password: 'password' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ id: 'user_id', username: 'user'});
    });

    test('should return 400 if username does not exist', async () => {
      const response = await request(app)
        .post('/login')
        .query({ username: 'user', password: 'password' });
      
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Username does not exist');
    });

    test('should return 400 if password is incorrect', async () => {
      // create a user
      await db.collection('users').insertOne({ username: 'user', password: 'password' });

      const response = await request(app)
        .post('/login')
        .query({ username: 'user', password: 'incorrect_password' });
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Incorrect password');
    });
  });

  describe('Get User Info', () => {
    test('should return 200 and user info', async () => {
      // create a user
      await db.collection('users').insertOne({ username: 'user', password: 'password', _id: 'user_id' });

      const response = await request(app)
        .get('/get_user_info')
        .query({ username: 'user' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ username: 'user', password: 'password', _id: 'user_id' });
    });

    test('should return 400 if user does not exist', async () => {
      const response = await request(app)
        .get('/get_user_info')
        .query({ username: 'user' });
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('User does not exist');
    });
  });

  describe('Update Profile Picture', () => {
    test('should return 201 if user exists', async () => {
      // create a user
      await db.collection('users').insertOne({ username: 'user', password: 'password' });

      const response = await request(app)
        .post('/update_profile_picture')
        .query({ username: 'user', profilePicture: 'new_profile_picture_url' });
      
      expect(response.statusCode).toBe(201);
      expect(response.text).toBe('Profile picture updated');
    });

    test('should return 400 if user does not exist', async () => {
      const response = await request(app)
        .post('/update_profile_picture')
        .query({ username: 'user', profilePicture: 'profile_picture_url' });

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('User does not exist');
    });
  });
  
});