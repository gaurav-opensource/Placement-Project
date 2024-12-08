//import--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

import { Router } from "express";
import {  
    downloadProfile, 
    getallprofile,
    login,
    register,
    updateprofiledata,
    upload_profile_picture,
    updateprofile, 
    getUserandProfile,
    sendRequestConnection, 
    myConnectionRequest,
    whatAreMyConnections,
    acceptConnectionRequest // Corrected here
} from "../controller/user.controller.js";

import multer from 'multer';


const router = Router();

//import--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// Multer storage configuration for profile picture uploads --------------------------------------------------------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });
// Upload profile picture
router.route("/upload_profile_picture")
    .post(upload.single('profile_picture'), upload_profile_picture);

//multer end        ---------------------------------------------------------------------------------------------------------





// Routes  -------------------------------------------------------------------------------------------------------------------

router.route('/register').post(register);
router.route('/login').post(login);
router.route("/update_profile").post(updateprofile);
router.route("/get_user_and_profile").get(getUserandProfile);

// Update profile data
router.route("/update_profile_data").post(updateprofiledata);

// Get all profiles
router.route("/user/get_all_profile").get(getallprofile);

// Download user profile as a PDF
router.route("/user/download_resume").get(downloadProfile);

;

router.route("/user/send_connection_req").get(sendRequestConnection);
router.route("/user/get_connection_req").get(myConnectionRequest);
router.route("/user/user_connection_req").get(whatAreMyConnections);
router.route("/user/accept_connection_req").get(acceptConnectionRequest);

export default router;
