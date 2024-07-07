import express from 'express';
import verifyToken from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', verifyToken, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const { text } = req.body;
      const imageUrl = req.file ? `/uploads/posts/${req.file.filename}` : '';

      const newPost = { text, imageUrl };
      req.user.profile.posts.push(newPost);
      await req.user.save();

      res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

export default router;
