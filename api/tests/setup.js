const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const testDbPath = path.join(__dirname, 'test-db.json');
const adapter = new FileSync(testDbPath);
const db = low(adapter);

// Initialize test database with sample data
db.defaults({
  users: [
    {
      _id: 'test-user-id',
      guid: 'test-guid',
      isActive: true,
      balance: '$1,000.00',
      picture: 'http://placehold.it/32x32',
      age: 30,
      name: {
        first: 'Test',
        last: 'User',
      },
      email: 'test.user@example.com',
      password: 'test-password',
      phone: '+1 (555) 123-4567',
      address: '123 Test St, Test City, TC 12345',
    },
  ],
}).write();

process.env.JWT_SECRET = 'test-secret-key';

module.exports = {
  db,
  testUser: db.get('users').find({ _id: 'test-user-id' }).value(),
  cleanUp: () => {
    db.setState({ users: [] }).write();
  },
};
