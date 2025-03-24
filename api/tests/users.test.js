const request = require('supertest');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const { db, testUser, cleanUp } = require('./setup');

// Mock the database module
jest.mock('../db', () => require('./setup').db);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', require('../routes/users'));

describe('User Routes', () => {
  let authToken;

  beforeEach(() => {
    // Generate a valid JWT token before each test
    authToken = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET);
    // Reset database to initial state
    db.setState({
      users: [testUser],
    }).write();
  });

  afterAll(() => {
    cleanUp();
  });

  describe('GET /api/users/profile', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/users/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No token provided');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', testUser._id);
      expect(response.body).toHaveProperty('name.first', testUser.name.first);
      expect(response.body).not.toHaveProperty('password');
    });
  });

  describe('PUT /api/users/update', () => {
    const updateData = {
      name: {
        first: 'Updated',
        last: 'Name',
      },
      phone: '+1 (555) 999-8888',
      address: '456 Updated St',
    };

    it('should return 401 without token', async () => {
      const response = await request(app)
        .put('/api/users/update')
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No token provided');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .put('/api/users/update')
        .set('Authorization', 'Bearer invalid-token')
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should update user profile with valid token and data', async () => {
      const response = await request(app)
        .put('/api/users/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name.first', updateData.name.first);
      expect(response.body).toHaveProperty('name.last', updateData.name.last);
      expect(response.body).toHaveProperty('phone', updateData.phone);
      expect(response.body).toHaveProperty('address', updateData.address);
      expect(response.body).not.toHaveProperty('password');

      // Verify database was updated
      const updatedUser = db.get('users').find({ _id: testUser._id }).value();
      expect(updatedUser.name.first).toBe(updateData.name.first);
      expect(updatedUser.name.last).toBe(updateData.name.last);
      expect(updatedUser.phone).toBe(updateData.phone);
      expect(updatedUser.address).toBe(updateData.address);
    });

    it('should preserve existing data when updating partial information', async () => {
      const partialUpdate = {
        name: {
          first: 'Partially',
        },
      };

      const response = await request(app)
        .put('/api/users/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send(partialUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'name.first',
        partialUpdate.name.first
      );
      expect(response.body).toHaveProperty('name.last', testUser.name.last);
      expect(response.body).toHaveProperty('phone', testUser.phone);
      expect(response.body).toHaveProperty('address', testUser.address);
    });
  });
});
