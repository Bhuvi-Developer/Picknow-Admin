import { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PERMISSIONS, ACTIONS } from '../constants/permissions';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setErrors({});
    setFormData({ email: '', password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    // For admin login
    if (activeTab === 0) {
      const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      const admin = adminUsers.find(user => 
        user.email === formData.email && 
        user.password === formData.password
      );

      if (admin) {
        if (admin.status === 'inactive') {
          setError('Your account is inactive. Please contact super admin.');
          return;
        }

        // Ensure admin has permissions
        if (!admin.permissions) {
          admin.permissions = admin.role === 'super_admin' 
            ? Object.keys(PERMISSIONS).reduce((acc, key) => ({
                ...acc,
                [PERMISSIONS[key]]: [ACTIONS.READ, ACTIONS.WRITE, ACTIONS.DELETE]
              }), {})
            : Object.keys(PERMISSIONS).reduce((acc, key) => ({
                ...acc,
                [PERMISSIONS[key]]: [ACTIONS.READ]
              }), {});
            
          // Update admin in localStorage
          localStorage.setItem('adminUsers', JSON.stringify(
            adminUsers.map(user => user.id === admin.id ? admin : user)
          ));
        }

        localStorage.setItem('userType', 'admin');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(admin));
        navigate('/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    }
    // For vendor login
    else {
      const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
      const vendor = vendors.find(v => v.email === formData.email);
      
      if (vendor) {
        // In a real app, you would check the password hash
        // For demo, we'll just check if the vendor exists and is active
        if (vendor.status === 'active') {
          localStorage.setItem('userType', 'vendor');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('vendorId', vendor.id);
          navigate('/vendor-dashboard');
        } else {
          setError('Your account is inactive. Please contact admin.');
        }
      } else {
        setError('Invalid vendor credentials');
      }
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Admin" />
          <Tab label="Vendor" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.email}
            helperText={errors.email}
            autoComplete="email"
            placeholder={activeTab === 0 ? "admin@example.com" : "Enter your vendor email"}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.password}
            helperText={errors.password}
            autoComplete="current-password"
            placeholder={activeTab === 0 ? "admin123" : "Enter your password"}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            {activeTab === 0 ? 'Admin Login' : 'Vendor Login'}
          </Button>
        </Box>

        {activeTab === 1 && (
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Contact admin to register as a vendor
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Login; 