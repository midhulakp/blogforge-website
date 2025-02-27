import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Box,
  Button,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

// eslint-disable-next-line react/prop-types
const UsersTable = ({ users, onDeleteUser }) => (
  <Box sx={{ p: 3, color: "#fff" }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Button
        variant="contained"
        startIcon={<PersonAddIcon />}
        sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
      >
        Add User
      </Button>
    </Box>
    <TableContainer component={Paper} sx={{ backgroundColor: "#303030" }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#424242" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Username</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Role</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* eslint-disable-next-line react/prop-types */}
          {users.map((user) => (
            <TableRow
              key={user._id}
              sx={{ "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}
            >
              <TableCell sx={{ color: "#fff" }}>{user.username}</TableCell>
              <TableCell sx={{ color: "#fff" }}>{user.email}</TableCell>
              <TableCell sx={{ color: "#fff" }}>
                <Typography
                  sx={{
                    color: user.role === "admin" ? "primary.main" : "success.main",
                    fontWeight: "medium",
                  }}
                >
                  {user.role}
                </Typography>
              </TableCell>
              <TableCell>
                <IconButton size="small" sx={{ mr: 1, color: "#fff" }}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton size="small" sx={{ color: "#fff" }} onClick={() => onDeleteUser(user)}>
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

export default UsersTable;