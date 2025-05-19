// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./controllers/authController');
const postRoutes = require('./controllers/postController');
const requireAuth = require('./middlewares/requireAuth');

const app = express();
app.use(cors({
  origin: ['https://fe-jwt-dan-cors.vercel.app/'],
  credentials: true
}));
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✔️ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Auth (signup, login)
app.use('/api/auth', authRoutes);

// Protected posts routes
app.use('/api/posts', requireAuth, postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
