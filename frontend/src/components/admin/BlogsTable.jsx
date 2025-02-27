import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Button,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PostAddIcon from "@mui/icons-material/PostAdd";

// eslint-disable-next-line react/prop-types
const BlogsTable = ({ posts, onViewBlog, onDeleteBlog }) => (
  <Box sx={{ p: 3 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Button
        variant="contained"
        startIcon={<PostAddIcon />}
        sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
      >
        Add Blog
      </Button>
    </Box>
    <TableContainer component={Paper} sx={{ backgroundColor: "#303030", color: "#fff" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#424242" }}>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Title</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Author</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Category</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* eslint-disable-next-line react/prop-types */}
          {posts.map((post) => (
            <TableRow
              key={post._id}
              sx={{ "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" }, color: "#fff" }}
            >
              <TableCell sx={{ color: "#fff" }}>{post.title}</TableCell>
              <TableCell sx={{ color: "#fff" }}>{post.author?.username || "Unknown"}</TableCell>
              <TableCell sx={{ color: "#fff" }}>{post.category}</TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  sx={{ mr: 1, color: "#fff" }}
                  onClick={() => onViewBlog(post.slug)}
                >
                  <VisibilityIcon color="info" />
                </IconButton>
                <IconButton size="small" sx={{ mr: 1, color: "#fff" }}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton size="small" sx={{ color: "#fff" }} onClick={() => onDeleteBlog(post)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default BlogsTable;
