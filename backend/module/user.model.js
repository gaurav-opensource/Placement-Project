import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true, // Ensure username is unique
      
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    active: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
    
    },
    profilePicture: {
      type: String,
      default: "default.jpg", // You can store the URL of the profile picture here
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
    token: {
      type: String,
      default: '', // Can be used for password reset tokens or JWTs
    },
  },
);
const User = mongoose.model('User', userSchema);
export default User;
