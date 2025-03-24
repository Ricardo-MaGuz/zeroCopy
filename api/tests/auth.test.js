const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { db, testUser, cleanUp } = require('./setup');

// Mock the database module
jest.mock('../db', () => require('./setup').db);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('../routes/auth'));

describe('Auth Routes', () => {
  beforeEach(() => {
    // Reset database to initial state
    db.setState({
      users: [testUser],
    }).write();
  });

  afterAll(() => {
    cleanUp();
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 with missing credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'wrong@email.com',
        password: 'wrong-password',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return token with valid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('_id', testUser._id);
      expect(response.body.user).not.toHaveProperty('password');
    });
  });
});
