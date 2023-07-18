const express = require("express");
const {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    getPostDetails,
    createPostReview,
    getPostReviews,
    deletePostReviews
} = require("../controllers/postController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/posts").get(getAllPosts);

router.route("/post/new").post(isAuthenticatedUser,createPost);

router.route("/admin/post/:id")
   .put(isAuthenticatedUser,updatePost,authorizeRoles("admin"))
   .delete(isAuthenticatedUser,deletePost,authorizeRoles("admin"))

router.route("/post/:id")
   .get(getPostDetails)
 
router.route("/review").put(isAuthenticatedUser, createPostReview);

router.route("/reviews").get(getPostReviews)
.delete(isAuthenticatedUser,deletePostReviews)

module.exports = router;