// import Profile from "../module/profile.model.js";
// import User from "../module/user.model.js";
// import Post  from '../module/post.model.js';





// export const activecheck = async (req, res) => {
//     return res.status(200).json({ message: 'reading' });
//  };

//  export const createPost = async (req, res) => {
//     const { token } = req.body;

//     try {
//         // Find user by token
//         const user = await User.findOne({ token });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Create a new post object
//         const post = new Post({
//             userId: user._id,
//             body: req.body.body,
//             media: req.file ? req.file.filename : "",  // Handle media file
//             fileType: req.file ? req.file.mimetype.split("/")[1] : ""  // Corrected mimetype typo
//         });

//         // Save the post to the database
//         await post.save();
//         return res.status(201).json({ message: 'Post created successfully' });

//     } catch (error) {
//         console.error('Error creating post:', error);  // Log error for debugging
//         return res.status(500).json({ message: 'Error creating post' });
//     }
// };


// export const getAllpost = async(req,res)=>{
//     try{
//         const post = await Post.find().populate('userId','name username email profilePicture');
//         return res.status(200).json({post});
//     }catch(error){
//         return res.status(500).json({ message: message.error });
//     }
// }

// export const DeletPost = async(req,res)=>{
//     const {token, post_id} = req.body;
//     try{
//         const user = await User
//         .findOne({token})
//         .select("_id");
//         if(!user){
//             return res.status(404).json({message: "User not found"})
//         }

//         const post = await Post.findOne({_id: post_id});
//         if(post.userId.toString !== user._id.toString){
//             return res.status(403).json({message: "Unutherside"});

//         }
//         await Post.DeletPost({_id: post_id});
//         return res.status(200).json({message: "Post deleted"});

//      }catch{
//         return res.status(500).json({message: "Error deleting post"});
//     }
// }

// export const commentPost = async(req,res)=>{
//     const {token, post_id, commentbody} = req.body;
//     try{
//         const user = await User.findOne({token}).select("_id");
//         if(!user){
//             return res.status(404).json({message: "User not found"})
//         }
//         const post = await Post.findOne({_id: post_id});
//         if(!post){
//             return res.status(404).json({message: "Post not found"});
//         }
//         const comment = new Comment({
//             userId:user_id,
//             postId: post_id,
//             comments: commentbody,
//         })

//         await comment.save();
//         return res.status(200).json({message: "Comment added"});



//     }catch(error){
//         return res.status(500).json({message: error.message});
//     }

// }


// export const get_comment_by_post = async(req,res)=>{
//     const {post_id} = req.body;
//     try{
//         const post = await User.findOne({_id: post_id});
//         if(!post){
//             return res.status(500).json({message: " Post Not found"});
//         }
//         return res.status(200).json({comments: post.comments})


//     }catch{
//         return res.status(500).json({message: "Error deleting comment"});
//     }
// }





import Profile from "../module/profile.model.js";
import User from "../module/user.model.js";
import Post from '../module/post.model.js';
import Comment from '../module/comment.model.js'; // Assuming you have a Comment model

export const activecheck = async (req, res) => {
    return res.status(200).json({ message: 'reading' });
};

export const createPost = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file ? req.file.filename : "",  // Handle media file
            fileType: req.file ? req.file.mimetype.split("/")[1] : ""  // Corrected mimetype typo
        });

        await post.save();
        return res.status(201).json({ message: 'Post created successfully' });

    } catch (error) {
        console.error('Error creating post:', error);  // Log error for debugging
        return res.status(500).json({ message: 'Error creating post' });
    }
};

export const getAllpost = async (req, res) => {
    try {
        const post = await Post.find().populate('userId', 'name username email profilePicture');
        return res.status(200).json({ post });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    const { token, post_id } = req.body;
    try {
        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findOne({ _id: post_id });
        if (post.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Post.deleteOne({"_id" : post_id});
        return res.status(200).json({ message: "Post deleted" });

    } catch (error) {
        return res.status(500).json({ message: "Error deleting post" });
    }
};

export const commentPost = async (req, res) => {
    const { token, post_id, commentbody } = req.body;
    try {
        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = new Comment({
            userId: user._id, // Fixed reference
            postId: post._id,
            comment: commentbody,
        });

        await comment.save();
        return res.status(200).json({ message: "Comment added" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const get_comment_by_post = async (req, res) => {
    const { post_id } = req.body;
    try {
        const post = await Post.findById(post_id).populate('comments.userId', 'name username'); // Assuming you store comments inside posts
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({ comments: post.comments });

    } catch (error) {
        return res.status(500).json({ message: "Error retrieving comments" });
    }
};

export const deleteComment = async (req, res) => {
    const { token, comment_id } = req.body;
    try {
        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const comment = await Comment.findOne({ "_id": comment_id });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Comment.findByIdAndDelete(comment_id);
        return res.status(200).json({ message: "Comment deleted" });

    } catch (error) {
        return res.status(500).json({ message: "Error deleting comment" });
    }
};


export const incrementLiks = async(req,res)=>{
    const { post_id}= req.body;

    try{
        const post = await Post.findById({_id: post_id});
        if(!post) return res.status(404).json({message: "Post not found"});
        post.likes++;
        await post.save();
        return res.status(200).json({message: "create Post"});

    }catch(error){
        return res.status(500).json({ message: "Error incrementing likes" });
    }
}