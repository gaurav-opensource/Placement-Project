import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who made the comment
      ref: 'User',
     
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the post being commented on
      ref: 'Post',
      
    },
    body: {
      type: String,
      required: true, // Comment content is required
      
      
    },
  },
 
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
