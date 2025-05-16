import Blog from '../DB/models/blog.model.js';
import User from '../DB/models/users.model.js';

// Create a new blog
export const createBlog = async (req, res) => {
  try {
    const { title, category, content, image } = req.body;
    const userId = req.user?.id; // assuming user is authenticated and user ID is in req.user

    // Validate input
    if (!title || !category || !content) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Fetch the user to use as author reference
    const author = await User.findById(userId);
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }

    const blog = new Blog({
      title,
      category,
      content,
      image,
      userId,
      author: author._id,
    });

    await blog.save();

    res.status(201).json({ success: true, data: blog });
  } catch (error) {

    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all blogs with filtering and pagination
export const getBlogs = async (req, res) => {
  try {
    const { category, author, page = 1, limit = 6 } = req.query;

    // Validate page and limit
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({ success: false, message: 'Invalid page number' });
    }
    if (isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({ success: false, message: 'Invalid limit' });
    }

    // Build the query
    let query = {};
    if (category) {
      query.category = category;
    }
    if (author) {
      query.author = author;
    }

    // Fetch blogs with pagination and populate author
    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 }) // Latest blogs first
      .exec();

    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const blog = await Blog.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};