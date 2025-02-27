import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import api from '../../utils/axios';

// eslint-disable-next-line react/prop-types
const StatCard = ({ icon, title, value, color }) => (
  <Card sx={{ height: '100%', backgroundColor: '#424242', color: '#fff' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1, color: '#f0f0f0' }}>{title}</Typography>
      </Box>
      <Typography variant="h4" color={color}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const AuthorDashboard = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      try {
        setError(null);
        setLoading(true);

        // Get all blogs for stats since /blog/stats endpoint doesn't exist
        const blogsResponse = await api.get('/blog');

        if (mounted) {
          // Calculate stats from blogs array
          const blogs = blogsResponse.data?.blogs || [];
          const stats = blogs.reduce((acc, blog) => {
            return {
              totalBlogs: acc.totalBlogs + 1,
              totalViews: acc.totalViews + (blog.views || 0),
              totalLikes: acc.totalLikes + (blog.likes?.length || 0),
              totalComments: acc.totalComments + (blog.comments?.length || 0)
            };
          }, {
            totalBlogs: 0,
            totalViews: 0,
            totalLikes: 0,
            totalComments: 0
          });

          setStats(stats);
          // Use most recent blogs for the recent blogs section
          setRecentBlogs(blogs.slice(0, 5)); // Show last 5 blogs
        }
      } catch (err) {
        if (mounted) {
          console.error('Error fetching dashboard data:', err);
          setError(err.response?.data?.message || 'Failed to load dashboard data');

          // Reset states on error
          setStats({
            totalBlogs: 0,
            totalViews: 0,
            totalLikes: 0,
            totalComments: 0
          });
          setRecentBlogs([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ color: '#000000' }}>
            Dashboard Overview
          </Typography>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ArticleIcon color="primary" />}
            title="Total Blogs"
            value={stats.totalBlogs}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<VisibilityIcon color="info" />}
            title="Total Views"
            value={stats.totalViews}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ThumbUpIcon color="success" />}
            title="Total Likes"
            value={stats.totalLikes}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CommentIcon color="warning" />}
            title="Comments"
            value={stats.totalComments}
            color="warning"
          />
        </Grid>

        {/* Recent Blogs */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: '#424242', color: '#fff' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#f0f0f0' }}>
              Recent Blog Posts
            </Typography>
            <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
            <List>
              {recentBlogs.map((blog) => (
                <ListItem key={blog._id} sx={{ color: '#f0f0f0' }}>
                  <ListItemText
                    primary={blog.title}
                    secondary={`Views: ${blog.views} • Likes: ${blog.likes.length} • Comments: ${blog.comments.length}`}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: '#f0f0f0',
                      },
                      '& .MuiListItemText-secondary': {
                        color: '#bdbdbd',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthorDashboard;