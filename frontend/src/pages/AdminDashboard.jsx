import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatCard from "../components/admin/StatCard";
import UsersTable from "../components/admin/UsersTable";
import BlogsTable from "../components/admin/BlogsTable";
import CategoriesTable from "../components/admin/CategoriesTable";
import api from "../utils/axios";

// eslint-disable-next-line react/prop-types
const TabPanel = ({ children, value, index }) => (
  <Box hidden={value !== index}>{value === index && children}</Box>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, postsResponse, categoriesResponse] =
        await Promise.all([
          api.get("/user"),
          api.get("/blog"),
          api.get("/category"),
        ]);
      setUsers(usersResponse.data);
      setPosts(postsResponse.data.blogs);
      setCategories(categoriesResponse.data);
    } catch (err) {
      setError(err.response?.data.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/user/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.response?.data.message || "Error deleting user");
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await api.delete(`/blog/${blogId}`);
      setPosts(posts.filter((post) => post._id !== blogId));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.response?.data.message || "Error deleting blog");
    }
  };

  const handleAddCategory = async (categoryName) => {
    try {
      const response = await api.post('/category', { name: categoryName });
      setCategories([...categories, response.data]);
    } catch (err) {
      setError(err.response?.data.message || 'Error adding category');
    }
  };

  const handleEditCategory = async (oldName, newName) => {
    try {
      const response = await api.patch(`/category/${oldName}`, { name: newName });
      setCategories(categories.map(cat => cat === oldName ? response.data : cat));
      // Update posts with new category name
      setPosts(posts.map(post => ({
        ...post,
        categories: post.categories === oldName ? newName : post.categories
      })));
    } catch (err) {
      setError(err.response?.data.message || 'Error updating category');
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    try {
      await api.delete(`/category/${categoryName}`);
      setCategories(categories.filter(cat => cat !== categoryName));
    } catch (err) {
      setError(err.response?.data.message || 'Error deleting category');
    }
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewBlog = (slug) => {
    navigate(`/blog/${slug}`);
  };

  const statsData = [
    { title: "Total Users", value: users.length, color: "primary.main" },
    { title: "Total Posts", value: posts.length, color: "secondary.main" },
    {
      title: "Active Authors",
      value: users.filter((user) => user.role === "author").length,
      color: "success.main",
    },
  ];

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}
        >
          Admin Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </Grid>

        <Paper elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Users Management" />
            <Tab label="Blog Management" />
            <Tab label="Categories Management" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <UsersTable users={users} onDeleteUser={openDeleteDialog} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <BlogsTable
              posts={posts}
              onViewBlog={handleViewBlog}
              onDeleteBlog={(blog) => {
                setSelectedBlog(blog);
                setDeleteDialogOpen(true);
              }}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <CategoriesTable 
              categories={categories} 
              posts={posts}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </TabPanel>
        </Paper>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle sx={{ pb: 2 }}>Confirm Delete</DialogTitle>
          <DialogContent sx={{ py: 1 }}>
            <Typography>
              Are you sure you want to delete{" "}
              {selectedUser
                ? `user ${selectedUser.username}`
                : `blog "${selectedBlog?.title}"`}
              ?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedUser) {
                  handleDeleteUser(selectedUser._id);
                } else if (selectedBlog) {
                  handleDeleteBlog(selectedBlog._id);
                }
              }}
              variant="contained"
              color="error"
              sx={{ textTransform: "none" }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
