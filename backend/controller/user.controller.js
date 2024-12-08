

import bcrypt from 'bcryptjs';
import User from '../module/user.model.js';
import Profile from '../module/profile.model.js';
import crypto from 'crypto';
import PDFDocument from "pdfkit";
import fs from 'fs';
import Connection from '../module/connection.model.js';



const convertUserdataintiPdf = (userData) => {
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString('hex') + ".pdf";



    // Step 2: Create a writable stream
    const stream = fs.createWriteStream('/uploads/'+ outputPath);


    doc.pipe(stream);
    console.log(`/uploads/${userData.userId.profilePicture}`);

    doc.image(`/uploads/${userData.userId.profilePicture}`, {align: "center", width : 500});
    doc.fontSize(20).text(`name ${userData.userId.name}`);
    doc.fontSize(20).text(`username ${userData.userId.username}`);
    doc.fontSize(15).text(`email ${userData.userId.email}`);
    doc.fontSize(15).text(`bio ${userData.bio}`);
    doc.fontSize(15).text(`image ${userData.profilepicture}`);
    
    
doc.fontSize(15).text("Past work:");
    userData.pastWork.forEach((work, index) => {
        doc.fontSize(15).text(`Company name: ${work.companyName}`);
        doc.fontSize(15).text(`Job title: ${work.position}`);
        doc.fontSize(15).text(`Duration: ${work.Year}`);
      });
    
     
    doc.end();
    return outputPath;
};







export const register = async (req, res) => { // Add req and res parameters
    try {
        const { name, email, password, username } = req.body;
        console.log(req.body);
        
        // Check if all fields are filled
        if (!password || !email || !username || !name) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });

        // Save the user
        await newUser.save();

        // Create a new profile associated with the user
        const profile = new Profile({ userId: newUser._id });
        await profile.save(); 

        return res.status(201).json({ message: 'User created successfully' });
        
    } catch (error) {
        console.error("Registration error:", error); // Log the error for debugging
        return res.status(500).json({ message: 'Error' });
    }
};








export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email field is provided
        if (!email || !password) {
            return res.status(404).json({ message: 'Please fill in all fields' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = crypto.randomBytes(32).toString("hex");

        await User.updateOne({_id: user._id}, {token});


        // Successful login - generate a response (consider generating a token here)
        return res.status(200).json({ 
          token
        });
        
    } catch (error) {
        console.error("Login error:", error); // Log the error for debugging
        return res.status(500).json({ message: 'Error' });
    }
};





//upload_profile_picture -------------------------------------------------------------------------------------------------------------

 
export const upload_profile_picture = async (req, res) => {
    try {
        const { token } = req.body;
        console.log(req.body);  // Retrieve token from URL parameters
        
        // Find the user with the given token
        const user = await User.findOne({ token });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        
        
        // Set the user's profile picture to the uploaded file's filename
        user.profilePicture = req.file.filename;

        // Save the updated user
        await user.save();

        // Send a success response
        return res.status(200).json({ message: 'Profile picture uploaded successfully' });

    } catch (error) {
        
        return res.status(500).json({ message: error.message });
    }
};

export default upload_profile_picture;

//upload_profile_picture -------------------------------------------------------------------------------------------------------------






//updateprofile ------------------------------------------------------------------------------------------------------------------


export const updateprofile = async(req,res)=>{
    try{
        const {token , ...newUserData}=req.body;

        const user=await User.findOne({token});

        if(!user){
            return res.status(400).json({message:'User not found'});
        }

        const { username , email} = newUserData;


        const existingUser = await User.findOne({ username , email });

        if(existingUser && existingUser._id.toString() !== user._id.toString()){
            return res.status(400).json({message:'Username or Email already exists'});
        }

        // user.username=username;
        // user.email = email;
        Object.assign(user,newUserData);

        await user.save();

        return res.status(200).json({message:'Profile updated successfully'});
        

    } catch(error) {
        return res.status(500).json({ message: error.message});
    }
}


//updateprofile ------------------------------------------------------------------------------------------------------------------


//getUserandProfile-------------------------------------------------------------------------------------------------------------------


export const getUserandProfile = async (req, res) => {
    try {
           const { token } = req.body;

        
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find profile using userId
        const Profile = await Profile.findOne({ userId: user._id })
            .populate("userId", "name username email profilepicture");  

        if (!Profile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        await Profile.save();
       
        return res.json(Profile);

    } catch (error) {
           return res.status(500).json({ message: error.message });
    }
};


//getUserandProfile-------------------------------------------------------------------------------------------------------------------




export const updateprofiledata = async (req, res) => {
    try {
        const { token, ...userProfileData } = req.body;

        // Find user by token
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find profile associated with the user
        const profile_to_update = await Profile.findOne({ userId: user._id });
        if (!profile_to_update) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Update profile with the new data
        Object.assign(profile_to_update, userProfileData);

        // Save the updated profile
        await profile_to_update.save();

        // Send the updated profile in the response
        return res.json(profile_to_update);

    } catch (error) {
        console.error('Error updating profile:', error);  // Log error for debugging
        return res.status(500).json({ message: 'Server error' });
    }
};


export const getallprofile = async(req,res)=>{
    try{
        const profiles = await Profile.find().populate("userId","name username email profilepicture");
        return res.json({profiles});

    }catch (error){
        return res.status(500).json({ message: 'Server error' });
    }
    
}



export const downloadProfile = async(req,res)=>{

    const user_id = req.query.id;
   
    const userProfile = await Profile.findOne({userId: user_id})
        .populate("userId", "name username email profilepicture");
        if (!userProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }


        let pdfResult = await convertUserdataintiPdf(userProfile);


        return res.json({ message: pdfResult});



}


//sendRequestConnection ----------------------------------------------------------------------------------------------------



export const sendRequestConnection = async (req, res) => {
    const { token, connectionId } = req.body;

    try {
       
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

       
        const connectionUser = await User.findOne({ _id: connectionId });  // Changed variable name for readability
        if (!connectionUser) {
            return res.status(404).json({ message: 'Connection user not found' });
        }

        const existingRequest = await Connection.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Connection request already sent to this user' });  // Improved error message
        }

      
        const newConnectionRequest = new Connection({
            userId: user._id,
            connectionId: connectionUser._id
        });

        await newConnectionRequest.save();
        return res.json({ message: 'Connection request sent successfully' });

    } catch (error) {
        console.error('Error sending connection request:', error);  
        return res.status(500).json({ message: 'Server error' });
    }
};



//sendRequestConnection ----------------------------------------------------------------------------------------------------





// myConnectionRequest -------------------------------------------------------------------------------------------------

export const myConnectionRequest = async (req, res) => {  
    const { token } = req.body;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

    
        const connections = await Connection.find({ userId: user._id })
            .populate('connectionId', 'name username email profilepicture');  

        return res.json(connections);

    } catch (error) {
        console.error('Error fetching connection requests:', error); 
        return res.status(500).json({ message: 'Server error' });
    }
};


// myConnectionRequest -------------------------------------------------------------------------------------------------


//whatAreMyConnections ----------------------------------------------------------------------------------------

export const whatAreMyConnections = async (req, res) => {
    const { token } = req.body;

    try {
       
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

      
        const connections = await Connection.find({ connectionId: user._id })
            .populate('userId', 'name username email profilepicture'); 
        return res.json(connections);

    } catch (error) {
        console.error('Error fetching connections:', error); 
        return res.status(500).json({ message: 'Server error' });
    }
};

//whatAreMyConnections ----------------------------------------------------------------------------------------



//acceptConnectionRequest ----------------------------------------------------------------------------------------
const acceptConnectionRequest = async (req, res) => {
    const { token, requestId, action_type } = req.body;

    try {
        if (!token || !requestId || !action_type) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const connection = await Connection.findById(requestId);
        if (!connection) {
            return res.status(404).json({ message: 'Connection not found' });
        }

        if (action_type === "accept") {
            connection.status_accept = true;
        } else if (action_type === "reject") {
            connection.status_accept = false;
        } else {
            return res.status(400).json({ message: 'Invalid action type' });
        }

        await connection.save();
        return res.json({ message: 'Request updated successfully' });

    } catch (error) {
        console.error('Error updating connection request:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Exporting the function correctly
export { acceptConnectionRequest }; // Use named export

//acceptConnectionRequest ----------------------------------------------------------------------------------------

