const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

// Signup
router.post('/signup', async (req, res)=>{
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, cart: [] });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || '7d' });
    return res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res)=>{
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email }).populate('cart.item');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || '7d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email }, token, cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
