const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(
  cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
