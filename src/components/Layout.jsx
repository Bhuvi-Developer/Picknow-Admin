import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Tabs,
  Tab,
  Button,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import usePermissions from '../hooks/usePermissions';
import { PERMISSIONS, ACTIONS } from '../constants/permissions';

// Memoize the Tab component
const NavTab = memo(({ label, ...props }) => (
  <Tab
    label={label}
    {...props}
    sx={{
      ...props.sx,
      '&:focus': {
        outline: 'none',
      },
    }}
  />
));

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = useState(0);
  const { canRead, isSuperAdmin } = usePermissions();

  // Update menuItems with correct permission keys
  const menuItems = useMemo(() => {
    const items = [
      { text: 'Dashboard', path: '/dashboard', permission: PERMISSIONS.DASHBOARD },
      { text: 'Products', path: '/products', permission: PERMISSIONS.PRODUCTS },
      { text: 'Categories', path: '/categories', permission: PERMISSIONS.CATEGORIES },
      { text: 'Vendors', path: '/vendors', permission: PERMISSIONS.VENDORS },
      { text: 'Offers', path: '/offers', permission: PERMISSIONS.OFFERS },
      { text: 'Combo Offers', path: '/combo-offers', permission: PERMISSIONS.COMBO_OFFERS },
      { text: 'Deals', path: '/deals', permission: PERMISSIONS.DEALS },
      { text: 'Admin Users', path: '/admin-users', permission: PERMISSIONS.ADMIN_USERS },
    ];

    // If super admin, show all items
    if (isSuperAdmin) {
      return items;
    }

    // For regular admin, filter based on read permissions
    return items.filter(item => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser?.permissions) return false;
      return currentUser.permissions[item.permission]?.includes(ACTIONS.READ);
    });
  }, [isSuperAdmin]);

  // Memoize styles with stable references
  const styles = useMemo(() => ({
    appBar: {
      backgroundColor: '#fff',
      boxShadow: 'none',
      borderBottom: '1px solid #e0e0e0',
    },
    toolbar: {
      minHeight: '64px',
      backgroundColor: theme.palette.primary.main,
    },
    title: {
      color: '#fff',
      fontWeight: 600,
      fontSize: isMobile ? '1.2rem' : '1.4rem',
    },
    logoutButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      },
      '&:focus': {
        outline: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      },
    },
    tabs: {
      backgroundColor: '#fff',
      minHeight: '48px',
      '& .MuiTab-root': {
        color: '#666',
        fontSize: isMobile ? '0.8rem' : '0.875rem',
        padding: isMobile ? '12px' : '16px 24px',
        fontWeight: 500,
        minHeight: '48px',
        transition: 'color 0.2s ease-in-out',
        '&.Mui-selected': {
          color: theme.palette.primary.main,
          fontWeight: 600,
        },
        '&:hover': {
          color: theme.palette.primary.main,
        },
        '&:focus': {
          outline: 'none',
        },
        '&.Mui-focusVisible': {
          backgroundColor: 'transparent',
        },
      },
      '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
        height: 2,
      },
    },
    tab: {
      minWidth: isMobile ? 'auto' : 120,
      textTransform: 'none',
      '&:focus': {
        outline: 'none',
      },
    },
    main: {
      flexGrow: 1,
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      paddingTop: '112px',
    },
    container: {
      padding: isMobile ? '16px' : '24px',
    }
  }), [theme.palette.primary.main, isMobile]);

  // Memoize handlers
  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
    navigate(menuItems[newValue].path);
  }, [navigate, menuItems]);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  // Update active tab based on location
  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => item.path === location.pathname);
    if (currentIndex >= 0 && currentIndex !== value) {
      setValue(currentIndex);
    }
  }, [location.pathname, menuItems, value]);

  // Check authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userType = localStorage.getItem('userType');

    if (!isLoggedIn || userType !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={styles.appBar}>
        <Toolbar sx={styles.toolbar}>
          <Typography variant="h6" component="div" sx={{ ...styles.title, flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={styles.logoutButton}
          >
            Logout
          </Button>
        </Toolbar>
        <Tabs
          value={value}
          onChange={handleChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          sx={styles.tabs}
          centered={!isMobile}
        >
          {menuItems.map((item) => (
            <NavTab
              key={item.text}
              label={item.text}
              sx={styles.tab}
              disableRipple
            />
          ))}
        </Tabs>
      </AppBar>

      <Box component="main" sx={styles.main}>
        <Container maxWidth="xl" sx={styles.container}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default memo(Layout); 