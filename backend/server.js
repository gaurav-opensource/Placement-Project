import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import postRoute from "./routes/post.route.js";
import userRoute from  "./routes/user.route.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // Ensure this line is included
app.use(express.static("uploads"));

const PORT = process.env.PORT || 9000;

// Routes
app.use(postRoute);
app.use(userRoute);

const MONGO_URL = "mongodb+srv://gauravwithhost1:gauravyadav95@airbnd.me7ow.mongodb.net/?retryWrites=true&w=majority&appName=airbnd";

// Start the server and connect to the database
const start = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL, {
    });
    console.log("Connected to the database");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1); // Exit the process with failure
  }
};

start();
