# User Profile API

A simple REST API for user authentication and profile management built with Express.js and lowdb.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Project Structure

```
.
├── api/                # Backend API
│   ├── routes/        # API routes
│   ├── tests/         # Test files
│   └── index.js       # API entry point
├── client/            # Frontend application
│   ├── public/        # Static files
│   └── server.js      # Client server
└── data/              # Database files
    └── users.json     # User data
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd zeroCopy
```

2. Install API dependencies:

```bash
cd api
npm install
```

3. Install client dependencies:

```bash
cd ../client
npm install
```

## Running the Application

1. Start the API server (from the api directory):

```bash
cd api
npm start
```

The API will be available at `http://localhost:3000`

2. Start the client server (from the client directory):

```bash
cd client
npm start
```

The client application will be available at `http://localhost:8080`

## Testing

The API includes a comprehensive test suite using Jest and Supertest.

To run the tests:

```bash
cd api
npm test
```

### Test Coverage

The test suite covers:

- Authentication

  - Login with valid/invalid credentials
  - Token validation
  - Error handling

- User Profile
  - Profile retrieval
  - Profile updates (full and partial)
  - Authorization checks
  - Data validation

### Available Test Users

For testing the application, you can use these credentials:

```
Email: henderson.briggs@geeknet.net
Password: 23derd*334
```

## API Endpoints

### Authentication

- `POST /api/auth/login`
  - Login with email and password
  - Returns JWT token and user data

### User Profile

- `GET /api/users/profile`

  - Get current user profile
  - Requires authentication token

- `PUT /api/users/update`
  - Update user profile
  - Requires authentication token
  - Supports partial updates

## Development

### Running Tests in Watch Mode

For development, you can run tests in watch mode:

```bash
cd api
npm test -- --watch
```

### Debugging

To debug the API:

1. Start the API with Node inspector:

```bash
node --inspect api/index.js
```

2. Open Chrome DevTools and connect to the debugger

## Troubleshooting

### Common Issues

1. Port already in use:

```bash
# Kill process using port 3000 (API)
sudo lsof -i :3000
kill -9 <PID>

# Kill process using port 8080 (Client)
sudo lsof -i :8080
kill -9 <PID>
```

2. Database connection issues:

- Check if `data/users.json` exists and has valid JSON
- Ensure write permissions on the data directory

## License

ISC
