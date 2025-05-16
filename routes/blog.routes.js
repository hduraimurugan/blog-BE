import express from 'express';
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller.js';
import {verifyAccessToken} from '../middleware/verifyToken.js'; // Optional: protect routes

const router = express.Router();

router.use(verifyAccessToken);

router.post('/create', createBlog);          // POST /api/blogs

router.get('/get', getBlogs);            // GET /api/blogs

router.get('/get/:id', getBlogById);      // GET /api/blogs/:id

router.put('/update/:id', updateBlog);       // PUT /api/blogs/:id

router.delete('/delete/:id', deleteBlog);    // DELETE /api/blogs/:id

export default router;