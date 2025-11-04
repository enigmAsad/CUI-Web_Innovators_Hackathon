import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import newRequest from '../../utils/newRequest';
import { toast } from 'react-toastify';
import './PostDetailPage.scss';
import DeleteIcon from '@mui/icons-material/Delete';

const PostDetailPage = ({ setUserRole }) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPostAndComments();
  }, [postId]);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      // Fetch post
      const { data: postData } = await newRequest.get(`/api/posts/${postId}`, { withCredentials: true });
      setPost(postData);
      
      // Fetch comments
      const { data: commentsData } = await newRequest.get(`/api/comments/post/${postId}`, { withCredentials: true });
      setComments(commentsData);
    } catch (err) {
      toast.error('Failed to load post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await newRequest.post('/api/comments', { content: newComment, post: postId }, { withCredentials: true });
      toast.success('Comment added!');
      setComments([data, ...comments]);
      setNewComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await newRequest.delete(`/api/comments/${commentId}`, { withCredentials: true });
      toast.success('Comment deleted');
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="post-detail-page">
        <Sidebar setUserRole={setUserRole} />
        <div className="postDetailContainer">
          <Navbar />
          <div className="loading-spinner">Loading post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-page">
        <Sidebar setUserRole={setUserRole} />
        <div className="postDetailContainer">
          <Navbar />
          <div className="error-message">Post not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <Sidebar setUserRole={setUserRole} />
      <div className="postDetailContainer">
        <Navbar />
        <div className="post-detail-content">
          <button className="back-btn" onClick={() => navigate('/farmer/forum')}>
            ← Back to Forum
          </button>

          <article className="post-detail-card">
            <header className="post-detail-header">
              <h1 className="post-detail-title">{post.title}</h1>
              <div className="post-meta">
                <span className="post-author">By {post.author?.name || 'Unknown'}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </header>
            <div className="post-detail-body">
              <p>{post.content}</p>
            </div>
          </article>

          <section className="comments-section">
            <h2 className="comments-title">Comments ({comments.length})</h2>
            
            <form className="add-comment-form" onSubmit={handleAddComment}>
              <textarea
                placeholder="Add your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                required
              />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>

            {comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment._id} className="comment-card">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author?.name || 'Unknown'}</span>
                      <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                    <button className="delete-comment-btn" onClick={() => handleDeleteComment(comment._id)}>
                      <DeleteIcon fontSize="small" /> Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;

