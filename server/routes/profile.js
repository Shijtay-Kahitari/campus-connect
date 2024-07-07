import express from 'express';
import verifyToken from '../middlewares/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/me', verifyToken, (req, res) => {
  res.json(req.user);
});

// @route   PUT /api/profile/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const { github, linkedin, twitter, portfolio } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile.github = github || user.profile.github;
    user.profile.linkedin = linkedin || user.profile.linkedin;
    user.profile.twitter = twitter || user.profile.twitter;
    user.profile.portfolio = portfolio || user.profile.portfolio;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
