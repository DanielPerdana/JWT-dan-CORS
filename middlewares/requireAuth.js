// server/middlewares/requireAuth.js
const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    // cek apakah token masuk daftar hitam
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) return res.status(401).json({ error: 'Token is blacklisted' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
