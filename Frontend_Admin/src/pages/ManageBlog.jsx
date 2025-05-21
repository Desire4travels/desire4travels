// import { useState } from 'react';
// import './ManageBlog.css';

// const ManageBlog = () => {
//     const [formData, setFormData] = useState({
//         title: '',
//         author: '',
//         category: '',
//         content: '',
//         date: '',
//         excerpt: '',
//         status: '',
//         image: null,
//     });

//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: files ? files[0] : value,
//         }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const data = new FormData();
//         data.append('title', formData.title);
//         data.append('author', formData.author);
//         data.append('category', formData.category);
//         data.append('content', formData.content);
//         data.append('date', formData.date);
//         data.append('excerpt', formData.excerpt);
//         data.append('status', formData.status);
//         data.append('image', formData.image);

//         fetch('http://localhost:5000/blogs', {
//             method: 'POST',
//             body: data,
//         })
//             .then((res) => res.json())
//             .then((result) => {
//                 console.log('Success:', result);
//                 alert('Blog post added successfully!');
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//                 alert('Something went wrong.');
//             });
//     };

//     return (
//         <div>
//             <h1>Add New Blog Post</h1>
//             <form onSubmit={handleSubmit} encType="multipart/form-data">
//                 <input
//                     type="text"
//                     name="title"
//                     placeholder="Title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="author"
//                     placeholder="Author"
//                     value={formData.author}
//                     onChange={handleChange}
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="category"
//                     placeholder="Category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     required
//                 />
//                 <textarea
//                     name="content"
//                     placeholder="Content of the blog post"
//                     value={formData.content}
//                     onChange={handleChange}
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="date"
//                     placeholder="Date (YYYY-MM-DD)"
//                     value={formData.date}
//                     onChange={handleChange}
//                     required
//                 />
//                 <textarea
//                     name="excerpt"
//                     placeholder="Excerpt (short summary)"
//                     value={formData.excerpt}
//                     onChange={handleChange}
//                     required
//                 />
//                 <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     required
//                 >
//                     <option value="">Select Status</option>
//                     <option value="draft">Draft</option>
//                     <option value="published">Published</option>
//                 </select>
//                 <input
//                     type="file"
//                     name="image"
//                     accept="image/*"
//                     onChange={handleChange}
//                     required
//                 />
//                 <button type="submit">Add Blog Post</button>
//             </form>
//         </div>
//     );
// };

// export default ManageBlog;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./ManageBlog.css";

// const API_BASE_URL = "https://desire4travels-1.onrender.com/blogs";

// const Blog = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     author: "",
//     category: "",
//     content: "",
//     date: "",
//     excerpt: "",
//     alt: "",
//     status: "",
//     image: null,
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   const fetchBlogs = async () => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get(API_BASE_URL);
//       setBlogs(res.data);
//       setTimeout(() => setIsLoading(false), 500); // Animation delay
//     } catch (err) {
//       console.error("Error fetching blogs:", err);
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setFormData({ ...formData, image: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const payload = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       payload.append(key, value);
//     });

//     try {
//       if (editingId) {
//         await axios.put(`${API_BASE_URL}/${editingId}`, payload);
//       } else {
//         await axios.post(API_BASE_URL, payload);
//       }
//       await fetchBlogs();
//       setShowModal(false);
//       setEditingId(null);
//       setFormData({
//         title: "",
//         author: "",
//         category: "",
//         content: "",
//         date: "",
//         excerpt: "",
//         alt: "",
//         status: "",
//         image: null,
//       });
//     } catch (err) {
//       console.error("Error submitting form:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEdit = (blog) => {
//     setFormData({
//       title: blog.title,
//       author: blog.author,
//       category: blog.category,
//       content: blog.content,
//       date: blog.date,
//       excerpt: blog.excerpt,
//       alt: blog.alt,
//       status: blog.status,
//       image: null,
//     });
//     setEditingId(blog.id);
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this blog?")) return;
//     setIsLoading(true);
//     try {
//       await axios.delete(`${API_BASE_URL}/${id}`);
//       await fetchBlogs();
//     } catch (err) {
//       console.error("Error deleting blog:", err);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="manage-blog-container">
//       <h1 className="page-title">Manage Blog Posts</h1>

//       <button 
//         className="create-btn"
//         onClick={() => {
//           setFormData({
//             title: "",
//             author: "",
//             category: "",
//             content: "",
//             date: "",
//             excerpt: "",
//             alt: "",
//             status: "",
//             image: null,
//           });
//           setEditingId(null);
//           setShowModal(true);
//         }}
//       >
//         <span className="btn-icon">+</span> Create New Blog
//       </button>

//       {isLoading ? (
//         <div className="loading-animation">
//           <div className="spinner"></div>
//           <p>Loading blogs...</p>
//         </div>
//       ) : (
//         <div className="blog-list">
//           {blogs.map((blog) => (
//             <div key={blog._id} className="blog-card">
//               <div className="blog-card-header">
//                 <h3 className="blog-title">{blog.title}</h3>
//                 <span className={`status-badge ${blog.status}`}>
//                   {blog.status}
//                 </span>
//               </div>
//               <p className="blog-meta">
//                 <span className="meta-author">By {blog.author}</span>
//                 <span className="meta-date">
//                   {new Date(blog.date).toLocaleDateString()}
//                 </span>
//               </p>
//               <p className="blog-excerpt">{blog.excerpt}</p>
//               <div className="blog-actions">
//                 <button 
//                   className="edit-btn"
//                   onClick={() => handleEdit(blog)}
//                 >
//                   Edit
//                 </button>
//                 <button 
//                   className="delete-btn"
//                   onClick={() => handleDelete(blog.id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {showModal && (
//         <div className={`modal-overlay ${showModal ? "visible" : ""}`}>
//           <div className="modal">
//             <h2 className="modal-title">
//               {editingId ? "Edit Blog Post" : "Add New Blog Post"}
//             </h2>
//             <form onSubmit={handleSubmit} encType="multipart/form-data">
//               <div className="form-group">
//                 <label>Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   placeholder="Enter blog title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Author</label>
//                   <input
//                     type="text"
//                     name="author"
//                     placeholder="Author name"
//                     value={formData.author}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Category</label>
//                   <input
//                     type="text"
//                     name="category"
//                     placeholder="Category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>Content</label>
//                 <textarea
//                   name="content"
//                   placeholder="Write your blog content here..."
//                   value={formData.content}
//                   onChange={handleChange}
//                   required
//                   rows="5"
//                 />
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Date</label>
//                   <input
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Status</label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">Select Status</option>
//                     <option value="draft">Draft</option>
//                     <option value="published">Published</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>Excerpt</label>
//                 <textarea
//                   name="excerpt"
//                   placeholder="Short summary of your blog"
//                   value={formData.excerpt}
//                   onChange={handleChange}
//                   required
//                   rows="3"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Image Alt Text</label>
//                 <input
//                   type="text"
//                   name="alt"
//                   placeholder="Description for accessibility"
//                   value={formData.alt}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Featured Image</label>
//                 <div className="file-upload">
//                   <input
//                     type="file"
//                     name="image"
//                     accept="image/*"
//                     onChange={handleChange}
//                     {...(editingId ? {} : { required: true })}
//                   />
//                   <span className="file-upload-label">
//                     {formData.image ? formData.image.name : "Choose an image"}
//                   </span>
//                 </div>
//               </div>

//               <div className="modal-buttons">
//                 <button type="submit" className="submit-btn">
//                   {isLoading ? (
//                     <span className="btn-spinner"></span>
//                   ) : editingId ? (
//                     "Update"
//                   ) : (
//                     "Add"
//                   )}
//                 </button>
//                 <button 
//                   type="button" 
//                   className="cancel-btn"
//                   onClick={() => setShowModal(false)}
//                   disabled={isLoading}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Blog;



import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageBlog.css";

const API_BASE_URL = "https://desire4travels-1.onrender.com/blogs";

const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    content: "",
    date: new Date().toISOString().split('T')[0], // Default to today
    excerpt: "",
    alt: "",
    status: "draft",
    image: null,
    slug: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_BASE_URL);
      setBlogs(res.data);
      setTimeout(() => setIsLoading(false), 500); // Animation delay
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      const updatedFormData = { ...formData, [name]: value };
      
      // Auto-generate slug when title changes
      if (name === "title" && !editingId) {
        updatedFormData.slug = slugify(value);
      }
      
      setFormData(updatedFormData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        payload.append(key, value);
      }
    });

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, payload);
      } else {
        await axios.post(API_BASE_URL, payload);
      }
      await fetchBlogs();
      setShowModal(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      console.error("Error submitting form:", err);
      alert(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      category: "",
      content: "",
      date: new Date().toISOString().split('T')[0],
      excerpt: "",
      alt: "",
      status: "draft",
      image: null,
      slug: ""
    });
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      author: blog.author,
      category: blog.category,
      content: blog.content,
      date: blog.date,
      excerpt: blog.excerpt,
      alt: blog.alt,
      status: blog.status,
      image: null,
      slug: blog.slug
    });
    setEditingId(blog.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      await fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="manage-blog-container">
      <h1 className="page-title">Manage Blog Posts</h1>

      <button 
        className="create-btn"
        onClick={() => {
          resetForm();
          setEditingId(null);
          setShowModal(true);
        }}
      >
        <span className="btn-icon">+</span> Create New Blog
      </button>

      {isLoading ? (
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>Loading blogs...</p>
        </div>
      ) : (
        <div className="blog-list">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <div className="blog-card-header">
                <h3 className="blog-title">{blog.title}</h3>
                <span className={`status-badge ${blog.status}`}>
                  {blog.status}
                </span>
              </div>
              <p className="blog-meta">
                <span className="meta-author">By {blog.author}</span>
                <span className="meta-date">
                  {new Date(blog.date).toLocaleDateString()}
                </span>
                <span className="meta-slug">/{blog.slug}</span>
              </p>
              <p className="blog-excerpt">{blog.excerpt}</p>
              {blog.image && (
                <div className="blog-image-preview">
                  <img 
                    src={blog.image} 
                    alt={blog.alt || blog.title} 
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
              <div className="blog-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(blog)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(blog.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={`modal-overlay ${showModal ? "visible" : ""}`}>
          <div className="modal">
            <button 
              className="modal-close"
              onClick={() => setShowModal(false)}
              disabled={isLoading}
            >
              &times;
            </button>
            
            <h2 className="modal-title">
              {editingId ? "Edit Blog Post" : "Add New Blog Post"}
            </h2>
            
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Title*</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter blog title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {!editingId && (
                <div className="form-group">
                  <label>Slug*</label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="URL-friendly slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    title="Slug can only contain lowercase letters, numbers, and hyphens"
                  />
                  <small className="slug-hint">
                    This will be part of the URL: /blogs/{formData.slug || 'your-slug'}
                  </small>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Author*</label>
                  <input
                    type="text"
                    name="author"
                    placeholder="Author name"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category*</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Content*</label>
                <textarea
                  name="content"
                  placeholder="Write your blog content here..."
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="5"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date*</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status*</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Excerpt*</label>
                <textarea
                  name="excerpt"
                  placeholder="Short summary of your blog"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Image Alt Text*</label>
                <input
                  type="text"
                  name="alt"
                  placeholder="Description for accessibility"
                  value={formData.alt}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Featured Image{!editingId && '*'}</label>
                <div className="file-upload">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    {...(editingId ? {} : { required: true })}
                  />
                  <span className="file-upload-label">
                    {formData.image ? formData.image.name : "Choose an image"}
                  </span>
                </div>
                {editingId && (
                  <small className="image-hint">
                    Leave empty to keep current image
                  </small>
                )}
              </div>

              <div className="modal-buttons">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="btn-spinner"></span>
                  ) : editingId ? (
                    "Update Blog"
                  ) : (
                    "Publish Blog"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;