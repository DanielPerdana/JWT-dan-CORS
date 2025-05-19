// server/controllers/postController.js
const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

// GET /api/posts
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author','username');
  res.json(posts);
});

// POST /api/posts
router.post('/', async (req, res) => {
  const post = await Post.create({ ...req.body, author: req.user.id });
  res.status(201).json(post);
});

// PUT /api/posts/:id
router.put('/:id', async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
});

// DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
