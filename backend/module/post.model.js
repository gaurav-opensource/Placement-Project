import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Array of users who liked the post

    },
    body: {
      type: String,
      required: true, // Fixed the typo here
    },
    likes: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    media: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
  
    fileType: {
      type: String,
      default: "",
    },
  },
 
);

const Post = mongoose.model('Post', postSchema);
export default Post;
