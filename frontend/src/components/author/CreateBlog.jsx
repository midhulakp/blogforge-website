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
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categories: '',
    featuredImage: null
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const navigate = useNavigate();

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/category');
        setCategories(response.data);
      } catch (error) {
        setFetchError('Failed to load categories');
        console.error('Error fetching categories:', error);
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append('title', formData.title);
    form.append('content', formData.content);
    form.append('categories', formData.categories);
    if (formData.featuredImage) {
      form.append('featuredImage', formData.featuredImage);
    }

    try {
      await api.post('/blog', form);
      navigate('/author/blogs');
    } catch (error) {
      console.error('Error creating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, featuredImage: e.target.files[0] });
  };

  if (fetchingCategories) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Create New Blog Post
        </Typography>

        {fetchError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {fetchError}
          </Alert>
        )}

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
          rows={4}
          fullWidth
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
        <FormControl fullWidth required>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={formData.categories}
            label="Category"
            onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box>
          <Button variant="outlined" component="label">
            Upload Featured Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          {formData.featuredImage && (
            <Typography variant="body2" sx={{ ml: 1 }}>
              {formData.featuredImage.name}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Blog'}
        </Button>
      </Paper>
    </Container>
  );
};

export default CreateBlog;