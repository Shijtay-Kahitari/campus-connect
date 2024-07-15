import express from "express";
import verifyToken from "../middlewares/auth.js";
import User from "../models/User.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// @route   GET /api/profile/me
// @desc    Get current user profile
// @access  Private
// router.get("/me", (req, res) => {

//   const {id} = req.body;
//   const user = User.findById(id);
//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }
//   const dataToSend
//   res.json(req.user);
// });

// @route   PUT /api/profile/update-profile
// @desc    Update user profile
// @access  Private
router.post(
  "/update-profile/:username", verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    const {
      firstName,
      lastName,
      username,
      email,
      bio,
      github,
      website,
      instagram,
      facebook,
      twitter,
      youtube,
    } = req.body;

    const usernameParams = req.params.username;
    console.log(usernameParams);
    // console.log(req.body);
    try {
      const user = await User.findOne({ username: usernameParams });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      user.fname = firstName;
      user.lname = lastName;
      user.username = username;
      user.email = email;
      user.bio = bio;
      user.social_links.github = github;
      user.social_links.website = website;
      user.social_links.instagram = instagram;
      user.social_links.facebook = facebook;
      user.social_links.twitter = twitter;
      user.social_links.youtube = youtube;

      // Update profile picture if a new file is uploaded
      if (req.file) {
        user.profilePicture = req.file.path;
      }

      await user.save();

      const data = {
        username : user.username,
        role : user.role,
        profilePicture : user.profilePicture,
        name : user.fname,
        email : user.email,
    

      }

      res
        .status(200)
        .json({ success: true, message: "Profile updated successfully" ,data: data});
    } catch (error) {
      console.error("Error updating profile:", error.message);
      if (error.code == 11000) {
        return res
          .status(400)
          .json({ success: false, message: "Username already exists" });
      }
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

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
        username: req.body.username,
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
  const { username } = req.body;

  try {
    const user = await User.findOne({ username }).select("-password -posts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
