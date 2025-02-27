import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountSettings from './AccountSettings';

const Navbar = () => {
  const { user, logout } = useAuth();

  

  const [anchorEl, setAnchorEl] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsOpen = () => {
    handleMenuClose();
    setOpenSettings(true);
  };

  const handleSettingsClose = () => {
    setOpenSettings(false);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const renderMenuItems = () => {
    return [
      <MenuItem key="username" disabled>
        <Typography variant="body2">
          Signed in as {user.username}
        </Typography>
      </MenuItem>,
      <Divider key="divider" />,
      <MenuItem 
        key="dashboard" 
        component={RouterLink} 
        to="/admin/dashboard"
        onClick={handleMenuClose}
        sx={{ display: user?.role === 'admin' ? 'block' : 'none' }}
      >
        Dashboard
      </MenuItem>,
      <MenuItem key="settings" onClick={handleSettingsOpen}>
        Account Settings
      </MenuItem>,
      <MenuItem key="logout" onClick={handleLogout}>
        Logout
      </MenuItem>
    ];
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: '#121212', // Dark background
        color: 'white', // Light text
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
        transition: 'background-color 0.3s ease', // Smooth transition
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 700,
            '&:hover': { // Hover effect
              color: '#90caf9', // Lighter blue on hover
            },
            transition: 'color 0.3s ease',
          }}
        >
          BlogForge
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/contact"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)', // Subtle background on hover
              },
            }}
          >
            Contact
          </Button>
          
          {user ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <Avatar 
                  src={user.photo} 
                  alt={user.username}
                  sx={{ width: 32, height: 32, bgcolor: '#64b5f6' }} // Use a default background color
                >
                  {user.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{ // Styling the menu
                  style: {
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                  },
                }}
              >
                {renderMenuItems()}
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/signin"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Sign In
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/signup"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
      
      <AccountSettings 
        open={openSettings} 
        onClose={handleSettingsClose} 
      />
    </AppBar>
  );
};

export default Navbar;