import { Router } from "express";
import multer from "multer"; // Ensure multer is imported
import {  commentPost, createPost, deleteComment, deletePost, get_comment_by_post, getAllpost, incrementLiks} from "../controller/post.controller.js"; // Import the necessary controllers

const router = Router();

// Multer storage configuration for profile picture uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Destination folder for uploads
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);  // Use the original file name
    },
});

// File filter to allow only specific file types (optional, but good for security)
const fileFilter = (req, file, cb) => {
    // Accept only image files (jpeg, png, etc.)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,  
});

// router.route("/upload_profile_picture")
//     .post(upload.single('profile_picture'), upload_profile_picture); 

router.route('/post').post(upload.single("media"), createPost);
router.route('/getallpost').get(getAllpost);
router.route('/deletepost').get(deletePost);
router.route('/commentPost').get(commentPost);
router.route('/deletecomment').get(deleteComment);
router.route('/getcomment').get(get_comment_by_post);
router.route('/incrementLikes').get(incrementLiks);


export default router;
