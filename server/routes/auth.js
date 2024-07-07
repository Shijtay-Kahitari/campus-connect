import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { genereteUsername } from "../helper/username.js";

const router = express.Router();
dotenv.config();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  console.log(req.body);

  try {
    // Check if user with the same email already exists
    let userExist = await User.findOne({ "profile.email": email });

    if (userExist) {
      // User already exists, return a 400 Bad Request status
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Generate a username based on email (assuming this function exists)
    const username = await genereteUsername(email);
    console.log(fname, lname, username, email, password);

    // Create a new user object and save it to the database
    const user = new User({
      profile: { username, fname, lname, email, password },
    });

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    user.profile.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate JWT token for the new user
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        // Return a 200 Created status along with the token and success true

        const dataToSend = {
          token,
          user: {
            id: user.id,
            role: user.role,
          },
        };

        res.status(200).json({ success: true, dataToSend });
      }
    );
  } catch (error) {
    console.error(error.message);
    // If there's an error, return a 500 Internal Server Error status with success false
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
