// server/models/TokenBlacklist.js
const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token:     { type: String, required: true },
  expiredAt: { type: Date,   required: true }, // tanggal kedaluwarsa token
});

// otomatis hapus token blacklist yang kadaluarsa
tokenBlacklistSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
