const Post  = require("../models/posts");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require('../utils/apifeatures')
const cloudinary = require("cloudinary")

//==== create post(Admin) ====
exports.createPost = catchAsyncErrors(
    async (req,res,next)=>{
    let images = [];
    if(typeof req.body.images==="string"){
      images.push(req.body.images)
    }
    else{
      images = req.body.images;
    }
    
    const imagesLinks = [];
    for(let i =0;i<images.length;i++){
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder: "Assets",
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const post  = await Post.create(req.body);
    res.status(200).json({
        success:true,
        post
    });

});

//==== Get all posts ====
exports.getAllPosts = catchAsyncErrors(
    async(req,res)=>{
    
    const resultPerPage = 8;
    const postCount = await Post.countDocuments();

    const apiFeature = new ApiFeatures(Post.aggregate(
        [{$sample:{size:resultPerPage}}]
    ),req.query)
    .pagination(resultPerPage);

    // const apiFeature = new ApiFeatures(Post.find(),req.query)
    // .search()
    // .filter()
    // .pagination(resultPerPage);

    const posts = await apiFeature.query;

    res.status(200).json({
        success:true,
        posts,
        postCount
    });
});

//==== Get Post Details ====
exports.getPostDetails = catchAsyncErrors(
    async(req,res,next)=>{
    const post = await Post.findById(req.params.id);
    if(!post){
        return next(new ErrorHandler("product not found",404));
    }
    res.status(200).json({
            success:true,
            post,
    })
})

// ==== Update product(Admin) ====
exports.updatePost = catchAsyncErrors(
    async (req,res,next)=>{
    let post = await Post.findById(req.params.id);

    if(!post){
        return next(new ErrorHandler("product too be updated not found",500));
    }
    
    post = await Post.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        post
    })
})

//==== delete post ====
exports.deletePost =catchAsyncErrors( 
    async(req,res,next)=>{
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(500).json({
            success:false,
            message:'post not found'
        })
    }
    await Post.findByIdAndDelete(req.params.id) ;
    
    res.status(200).json({
        success:true,
        message:'post deleted successfully..'
    })
})

// create new review or update the review
exports.createPostReview = catchAsyncErrors(async (req,res, next)=>{
    const {rating,comment,postId} = req.body;
    const review = {
        user: req.user._id,
        name:req.user.name,
        rating: Number(rating),
        comment,
    }

    const post = await Post.findById(postId);

    const isReviewed = post.reviews.find(rev=> rev.user.toString() === req.user._id)

    if(isReviewed){
        post.reviews.forEach(rev=>{
            if(rev.user.toString() === req.user._id.toString())
            rev.rating = rating,
            rev.comment = comment
        })
    }
    else{
        post.reviews.push(review);
        post.numberOfReviews = post.reviews.length
    }

    let avg = 0;

    post.ratings = post.reviews.forEach((rev)=>{
        avg += rev.rating;
    }) 
    const avgVal = avg / post.numberOfReviews;
    post.ratings = avgVal.toFixed(1).toString()
    await post.save({validateBeforeSave: false });

    res.status(200).json({
        success: true,
    })
})

// Get All Reviews of a single post

exports.getPostReviews = catchAsyncErrors(async(req,res,next)=>{
    const post = await Post.findById(req.query.id);

    if(!post){
        return next(new ErrorHandler("post not found", 404));
    }

    res.status(200).json({
        success:true,
        reviews: post.reviews,
    });
});

// Delete Reviews of a single post
exports.deletePostReviews = catchAsyncErrors(async(req,res,next)=>{
    const post = await Post.findById(req.query.postId);

    if(!post){
        return next(new ErrorHandler("post not found", 404));
    }

    const reviews = post.reviews.filter(rev=> rev._id.toString() !== req.query.id.toString());
    
    const numberOfReviews = reviews.length;

    let avg = 0;

    reviews.forEach((rev)=>{
        avg += rev.rating;
    }) 
    
    const avgVal = avg / numberOfReviews;

    const ratings = avgVal.toFixed(1).toString();


    await Post.findByIdAndUpdate(req.query.postId,{
        reviews,
        ratings,
        numberOfReviews,
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    });
});
