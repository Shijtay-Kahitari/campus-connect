import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import postRoutes from "./routes/posts.js";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'uploads' directory
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);

// Default route
app.get("/", (req, res) => res.send("API Running"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
