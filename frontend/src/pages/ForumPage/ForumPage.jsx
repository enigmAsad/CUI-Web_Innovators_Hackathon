import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import newRequest from '../../utils/newRequest';
import { toast } from 'react-toastify';
import './ForumPage.scss';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const ForumPage = ({ setUserRole }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await newRequest.get('/api/posts/getPost', { withCredentials: true });
      setPosts(data);
    } catch (err) {
      toast.error('Failed to load forum posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await newRequest.post('/api/posts/create', newPost, { withCredentials: true });
      toast.success('Post created successfully!');
      setPosts([data.post, ...posts]);
      setNewPost({ title: '', content: '' });
      setShowCreateForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await newRequest.delete(`/api/posts/${postId}`, { withCredentials: true });
      toast.success('Post deleted');
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
      console.error(err);
    }
  };

  const cleanMarkdown = (text) => {
    return text
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\#\#)(.*?)$/g, "")
      .replace(/\n/g, " ")
      .replace(/\*/g, "")
      .replace(/_/g, "");
  };

  return (
    <div className="forum-page">
      <Sidebar setUserRole={setUserRole} />
      <div className="forumContainer">
        <Navbar />
        <div className="forum-content">
          <div className="forum-header">
            <h1 className="forum-title">Community Forum</h1>
            <button className="create-post-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? <><CloseIcon fontSize="small" /> Cancel</> : <><AddIcon fontSize="small" /> Create Post</>}
            </button>
          </div>

          {showCreateForm && (
            <form className="create-post-form" onSubmit={handleCreatePost}>
              <input
                type="text"
                placeholder="Post Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                maxLength={100}
                required
              />
              <textarea
                placeholder="Post Content (support farming questions, tips, experiences...)"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={6}
                required
              />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Submit Post'}
              </button>
            </form>
          )}

          {loading ? (
            <div className="loading-spinner">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet. Be the first to start a discussion!</p>
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <div key={post._id} className="post-card">
                  <div className="post-header-card">
                    <h2 className="post-title" onClick={() => navigate(`/posts/${post._id}`)}>
                      {post.title}
                    </h2>
                    <span className="post-author">
                      By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="post-preview">
                    {cleanMarkdown(post.content).substring(0, 200)}
                    {post.content.length > 200 && '...'}
                  </p>
                  <div className="post-actions">
                    <button className="read-more-btn" onClick={() => navigate(`/posts/${post._id}`)}>
                      <CommentIcon fontSize="small" /> Read & Comment
                    </button>
                    <button className="delete-btn" onClick={() => handleDeletePost(post._id)}>
                      <DeleteIcon fontSize="small" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;

