import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/axios';

const EditBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categories: '',
    featuredImage: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blog/${slug}`);
        setFormData({
          title: data.title,
          content: data.content,
          categories: data.categories,
          featuredImage: null
        });
        setCurrentImage(data.featuredImage);
        setLoading(false);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError('Failed to fetch blog post');
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const form = new FormData();
    form.append('title', formData.title);
    form.append('content', formData.content);
    form.append('categories', formData.categories);
    if (formData.featuredImage) {
      form.append('featuredImage', formData.featuredImage);
    }

    try {
      await api.patch(`/blog/${slug}`, form);
      navigate('/author/blogs');
    } catch (error) {
      setError(error.response?.data.message || 'Error updating blog');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, featuredImage: e.target.files[0] });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Edit Blog Post
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Title"
          fullWidth
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <TextField
          label="Content"
          multiline
          rows={6}
          fullWidth
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />

        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.categories}
            label="Category"
            onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
          >
            <MenuItem value="Technology">Technology</MenuItem>
            <MenuItem value="Lifestyle">Lifestyle</MenuItem>
            <MenuItem value="Travel">Travel</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Personal">Personal</MenuItem>
          </Select>
        </FormControl>

        <Box>
          {currentImage && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Image:
              </Typography>
              <img 
                src={currentImage} 
                alt="Current featured" 
                style={{ maxWidth: '200px', height: 'auto' }} 
              />
            </Box>
          )}
          
          <Button variant="outlined" component="label">
            Change Featured Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          {formData.featuredImage && (
            <Typography variant="body2" sx={{ ml: 1 }}>
              New image selected: {formData.featuredImage.name}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/author/blogs')}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditBlog;