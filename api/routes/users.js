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

// Update user profile
router.put('/update', verifyToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.userId;

    // Find user in database
    const user = db.get('users').find({ _id: userId }).value();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    const updatedUser = {
      ...user,
      name: name || user.name,
      phone: phone || user.phone,
      address: address || user.address,
    };

    // Save to database
    db.get('users').find({ _id: userId }).assign(updatedUser).write();

    // Remove sensitive data before sending response
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

module.exports = router;
