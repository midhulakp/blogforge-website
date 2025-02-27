import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BlogProvider } from "./context/BlogContext";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import BlogDetail from "./pages/BlogDetail";
import AuthorLayout from "./layouts/AuthLayout";
import { Navigate } from "react-router-dom";
import MyBlogs from "./components/author/MyBlogs";
import CreateBlog from "./components/author/CreateBlog";
import AuthorDashboard from "./components/author/AuthorDashboard";
import EditBlog from "./components/author/EditBlog";
import Comments from "./components/author/Comments";

const theme = createTheme({
  palette: {
    mode: "light", // Or 'dark' for dark mode
    primary: {
      main: "#6750a4", // Deep Purple 500
      light: "#9a7dc2", // Deep Purple 300
      dark: "#47377a", // Deep Purple 700
      contrastText: "#fff",
    },
    secondary: {
      main: "#e3b505", // Amber 500
      light: "#ffdd4b", // Amber 300
      dark: "#b8860b", // Amber 700
      contrastText: "#000",
    },
    error: {
      main: "#b00020", // Red 700
      light: "#f2b8b5", // Red 300
      dark: "#7a0019", // Red 900
      contrastText: "#fff",
    },
    warning: {
      main: "#ffb300", // Amber 500
      light: "#ffe54c", // Amber 300
      dark: "#c68400", // Amber 700
      contrastText: "#000",
    },
    info: {
      main: "#29b6f6", // Light Blue 500
      light: "#73e8ff", // Light Blue 300
      dark: "#0086c3", // Light Blue 700
      contrastText: "#000",
    },
    success: {
      main: "#388e3c", // Green 700
      light: "#6abf69", // Green 300
      dark: "#00600f", // Green 900
      contrastText: "#fff",
    },
    grey: {
      50: "#f8f9fa",
      100: "#e9ecef",
      200: "#dee2e6",
      300: "#ced4da",
      400: "#adb5bd",
      500: "#6c757d",
      600: "#495057",
      700: "#343a40",
      800: "#212529",
      900: "#121212",
    },
    background: {
      default: "#f8f9fa", // Light Grey
      paper: "#fff", // White
    },
    text: {
      primary: "#212529", // Dark Grey
      secondary: "#495057", // Medium Grey
      disabled: "#adb5bd", // Light Grey
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: "3rem",
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: "0em",
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: "0.00735em",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: "0em",
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: "0.0075em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: "0.00714em",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.57,
      letterSpacing: "0.01071em",
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: "0.02857em",
      textTransform: "uppercase",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: "0.03333em",
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 2.66,
      letterSpacing: "0.08333em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          color: "#fff",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

const App = () => {
  return (
    <AuthProvider>
      <BlogProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<Home />} />

              {/* Protected Routes */}
              <Route
                path="/blog/:slug"
                element={
                  <ProtectedRoute>
                    <BlogDetail />
                  </ProtectedRoute>
                }
              />
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={["admin", "author"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Author Routes */}
              <Route
                path="/author/*"
                element={
                  <ProtectedRoute roles={["author"]}>
                    <AuthorLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<AuthorDashboard />} />
                <Route path="blogs" element={<MyBlogs />} />
                <Route path="blogs/new" element={<CreateBlog />} />
                <Route path="blogs/edit/:slug" element={<EditBlog />} />
                <Route path="comments" element={<Comments />} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </BlogProvider>
    </AuthProvider>
  );
};

export default App;
