import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import AuthorSidebar from "../components/AuthorSidebar";
import { Outlet } from "react-router-dom";


const AuthorLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AuthorSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Navbar />
        <Outlet />
      </Box>
    </Box>
  );
};


export default AuthorLayout;