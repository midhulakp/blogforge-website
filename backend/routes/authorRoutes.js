import { Router } from "express";
import {
    getAuthorDashboardStats,
    getAuthorRecentBlogs,
    getAuthorComments,
    getAuthorBlogs // Import getAuthorBlogs
} from "../controllers/authorController.js";
import { auth, checkRole } from "../middlewares/auth.js";
import {
    postBlog,
    updateBlog,
    deleteBlog,
    ToggleLikeBlog
} from "../controllers/blogControllers.js"; // Re-use blog controllers
import { deleteComment } from "../controllers/commentControllers.js"; // Re-use comment controller
import multer from 'multer';
import storage from '../middlewares/fileUpload.js';


const upload = multer({ storage: storage });
const router = Router();

// All author routes are protected and require 'author' role
router.use(auth, checkRole('author')); // Apply auth and role check to all routes in this file

// Author Dashboard Routes
router.get("/dashboard/stats", getAuthorDashboardStats);
router.get("/dashboard/recent-blogs", getAuthorRecentBlogs);

// Author Blog Routes
router.get("/blogs", getAuthorBlogs); // Route for MyBlogs page
router.post("/blogs", upload.single("featuredImage"), postBlog); // Create Blog
router.patch("/blogs/:slug", upload.single("featuredImage"), updateBlog); // Edit Blog
router.delete("/blogs/:slug", deleteBlog); // Delete Blog
router.post("/blogs/:slug/like", ToggleLikeBlog); // Like/Unlike Blog (can be used by authors for their own blogs if needed)


// Author Comment Routes
router.get("/comments", getAuthorComments); // Get Comments on Author's Blogs
router.delete("/comments/:commentId", deleteComment); // Delete Comment (re-use existing)


export default router;