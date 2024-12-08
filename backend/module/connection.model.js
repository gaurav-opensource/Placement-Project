import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User who sent the connection request
      ref: 'User',
      
    },
    connectionId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User receiving the connection request
      ref: 'User',
      
    },
    status_accept: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'], // Status of the connection request
      default: 'pending', // Default to 'pending' until the request is accepted or rejected
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

const Connection = mongoose.model('Connection', connectionSchema);
export default Connection;
