import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
     author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: [true, 'Author is required'],
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;