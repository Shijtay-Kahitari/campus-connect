import express from "express";
import verifyToken from "../middlewares/auth.js";
import User from "../models/User.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// @route   GET /api/profile/me
// @desc    Get current user profile
// @access  Private
router.get("/me", verifyToken, (req, res) => {
  res.json(req.user);
});

// @route   PUT /api/profile/update-profile
// @desc    Update user profile
// @access  Private
router.put("/update-profile", verifyToken, async (req, res) => {
  try {
    const { github, linkedin, twitter, portfolio } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profile.github = github || user.profile.github;
    user.profile.linkedin = linkedin || user.profile.linkedin;
    user.profile.twitter = twitter || user.profile.twitter;
    user.profile.portfolio = portfolio || user.profile.portfolio;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/upload-profile-image",
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const user = await User.findOne({
        "profile.username": req.body.username,
      });

      user.profilePicture = req.file.path;
      await user.save();
      res.status(200).json({
        success: true,
        data: user.profilePicture,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

router.post("/get-profile", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({
      "profile.username": username,
    }).select("-profile.password -posts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
