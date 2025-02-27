import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../utils/axios';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingComments, setDeletingComments] = useState(new Set());
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    let mounted = true;

    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/blog');
        
        if (mounted) {
          const allComments = response.data.blogs.reduce((acc, blog) => {
            const blogComments = blog.comments.map(comment => ({
              ...comment,
              blogTitle: blog.title,
              blogSlug: blog.slug
            }));
            return [...acc, ...blogComments];
          }, []);
          
          allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setComments(allComments);
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || 'Failed to load comments');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchComments();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDeleteComment = async (blogSlug, commentId) => {
    if (deletingComments.has(commentId)) return;

    try {
      setDeletingComments(prev => new Set(prev).add(commentId));
      
      // Optimistic update
      setComments(prevComments => 
        prevComments.filter(comment => comment._id !== commentId)
      );

      await api.delete(`/blog/${blogSlug}/comments/${commentId}`);
      
      setNotification({
        open: true,
        message: 'Comment deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      // Rollback on error
      const response = await api.get('/blog');
      const allComments = response.data.blogs.reduce((acc, blog) => {
        const blogComments = blog.comments.map(comment => ({
          ...comment,
          blogTitle: blog.title,
          blogSlug: blog.slug
        }));
        return [...acc, ...blogComments];
      }, []);
      
      setComments(allComments);
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Failed to delete comment',
        severity: 'error'
      });
    } finally {
      setDeletingComments(prev => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Recent Comments
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {comments.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center">
            No comments yet
          </Typography>
        ) : (
          comments.map((comment, index) => (
            <Box key={index}>
              <ListItem
                secondaryAction={
                  <Tooltip title="Delete Comment">
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteComment(comment.blogSlug, comment._id)}
                      disabled={deletingComments.has(comment._id)}
                    >
                      {deletingComments.has(comment._id) ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemText
                  primary={comment.content}
                  secondary={
                    <>
                      <Typography variant="caption" display="block">
                        On: {comment.blogTitle}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        By: {comment.user?.email} •  ago
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </Box>
          ))
        )}
      </List>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Comments;