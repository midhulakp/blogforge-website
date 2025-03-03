import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js"; // Import Comment model
import asyncHandler from "express-async-handler";

//@desc     Get Author Dashboard Stats
//@route    /api/author/dashboard/stats
//@access   Private (Author)
export const getAuthorDashboardStats = asyncHandler(async (req, res) => {
    const authorId = req.userId; // Assuming req.userId is set by auth middleware

    const totalBlogs = await Blog.countDocuments({ author: authorId });
    const allAuthorBlogs = await Blog.find({ author: authorId });

    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;

    allAuthorBlogs.forEach(blog => {
        totalViews += blog.views || 0;
        totalLikes += blog.likes.length || 0;
        totalComments += blog.comments.length || 0;
    });


    res.status(200).json({
        totalBlogs,
        totalViews,
        totalLikes,
        totalComments
    });
});


//@desc     Get Recent Blogs for Author Dashboard
//@route    /api/author/dashboard/recent-blogs
//@access   Private (Author)
export const getAuthorRecentBlogs = asyncHandler(async (req, res) => {
    const authorId = req.userId;

    const recentBlogs = await Blog.find({ author: authorId })
        .sort({ createdAt: 'desc' })
        .limit(5) // Limit to 5 recent blogs as per your component
        .select('title slug views likes comments'); // Select only necessary fields

    res.status(200).json(recentBlogs);
});


//@desc     Get Comments for Author's Blogs
//@route    /api/author/comments
//@access   Private (Author)
export const getAuthorComments = asyncHandler(async (req, res) => {
    const authorId = req.userId;

    // Find all blog posts by the author
    const authorBlogs = await Blog.find({ author: authorId }, '_id'); // Get only _id of blogs

    if (!authorBlogs || authorBlogs.length === 0) {
        return res.status(200).json([]); // No blogs, no comments
    }

    const blogIds = authorBlogs.map(blog => blog._id);

    // Find comments related to the author's blogs and populate user and blog info
    const comments = await Comment.find({ blog: { $in: blogIds } })
        .populate({
            path: 'user',
            select: 'username email photo' // Select user fields you need
        })
        .populate({
            path: 'blog',
            select: 'title slug' // Select blog fields you need
        })
        .sort({ createdAt: 'desc' });

    res.status(200).json(comments);
});

//@desc     Get Blogs for MyBlogs page (Author's own blogs)
//@route    /api/author/blogs
//@access   Private (Author)
export const getAuthorBlogs = asyncHandler(async (req, res) => {
    const authorId = req.userId;

    const blogs = await Blog.find({ author: authorId })
        .sort({ createdAt: 'desc' })
        .select('title slug categories views likes comments'); // Select fields needed for MyBlogs table

    res.status(200).json(blogs);
});