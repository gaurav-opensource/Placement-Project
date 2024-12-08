import mongoose from 'mongoose';

// Education Schema
const educationSchema = new mongoose.Schema(
  {
    school: {
      type: String,
      default:""
      
    },
    degree: {
      type: String,
      default:""
      
    },
    fieldOfStudy: {
      type: String,
     default:""
     
    },
  });


  
// Work Schema
const workSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      default:""
      
    },
    position: {
      type: String,
      default:""
      
    },
    year: {
      type: Number,
      default:""
    },
   
  },
)

// Profile Schema
const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model

    },
    bio: {
      type: String,
      default:""
    },
    currentPost: {
      type: String,
      default:"",
     
    },
    pastWork: {
      type:[workSchema], 
      default:[]
    },
     
    education: {
      type: [educationSchema],
      default:[]
      },
  },

);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
