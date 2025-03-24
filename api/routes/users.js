const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
  try {
    const user = db.get('users').find({ _id: req.userId }).value();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/update', verifyToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.userId;

    const user = db.get('users').find({ _id: userId }).value();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = {
      ...user,
      name: name || user.name,
      phone: phone || user.phone,
      address: address || user.address,
      updatedAt: new Date().toISOString(),
    };

    db.get('users').find({ _id: userId }).assign(updatedUser).write();

    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user profile',
      error: error.message,
    });
  }
});

module.exports = router;
