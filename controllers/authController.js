// server/controllers/authController.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const TokenBlacklist = require('../models/TokenBlacklist');

router.post('/signup', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: 'User created' });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
  res.json({ token });
});

// server/controllers/authController.js
const requireAuth = require('../middlewares/requireAuth');
// …

// setelah router.post('/login'…)
router.get('/me', requireAuth, async (req, res) => {
  // req.user.id sudah di-set oleh requireAuth
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

router.post('/logout', requireAuth, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    await TokenBlacklist.create({
      token,
      expiredAt: new Date(payload.exp * 1000),
    });

    res.json({ message: 'Logout successful. Token revoked.' });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
});
module.exports = router;
