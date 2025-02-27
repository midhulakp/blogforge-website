import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CommentIcon from '@mui/icons-material/Comment';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const drawerWidth = 240;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon sx={{ color: 'white' }} />,
    path: '/author/dashboard'
  },
  {
    text: 'My Blogs',
    icon: <ArticleIcon sx={{ color: 'white' }} />,
    path: '/author/blogs'
  },
  {
    text: 'Create Blog',
    icon: <AddCircleIcon sx={{ color: 'white' }} />,
    path: '/author/blogs/new'
  },
  {
    text: 'Comments',
    icon: <CommentIcon sx={{ color: 'white' }} />,
    path: '/author/comments'
  }
];

const AuthorSidebar = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: '#303030', // Dark background color
          color: '#fff', // White text color for better readability
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8, color: '#f0f0f0' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
            Author Dashboard
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={RouterLink}
              to={item.path}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                },
                borderRadius: 1,
                mx: 1,
                width: 'auto'
              }}
            >
              <ListItemIcon sx={{
                color: location.pathname === item.path ? 'primary.main' : 'inherit'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: 'white',
                    fontWeight: location.pathname === item.path ? 600 : 400
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AuthorSidebar;