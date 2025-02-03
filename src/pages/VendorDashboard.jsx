import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const vendorId = localStorage.getItem('vendorId');
    const userType = localStorage.getItem('userType');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn || userType !== 'vendor') {
      navigate('/login');
      return;
    }

    const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
    const currentVendor = vendors.find(v => v.id === vendorId);
    
    if (!currentVendor) {
      navigate('/login');
      return;
    }

    setVendor(currentVendor);
    setFormData({
      email: currentVendor.email,
      phone: currentVendor.phone,
      address: currentVendor.address,
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('vendorId');
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
    const updatedVendors = vendors.map(v => 
      v.id === vendor.id ? { ...v, ...formData } : v
    );
    
    localStorage.setItem('vendors', JSON.stringify(updatedVendors));
    setVendor(prev => ({ ...prev, ...formData }));
    setOpenEdit(false);
  };

  if (!vendor) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Vendor Dashboard</Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Typography variant="h6">Profile Information</Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => setOpenEdit(true)}
              >
                Edit
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={vendor.image}
                alt={vendor.name}
                sx={{ width: 100, height: 100, mr: 2 }}
              />
              <Box>
                <Typography variant="h5">{vendor.name}</Typography>
                <Chip
                  label={vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                  color={vendor.status === 'active' ? 'success' : 'error'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {vendor.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Phone:</strong> {vendor.phone}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Address:</strong> {vendor.address}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>GST Number:</strong> {vendor.gstNumber}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>PAN Number:</strong> {vendor.panNumber}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>KYC Status:</strong>{' '}
              <Chip
                label={vendor.kycStatus.charAt(0).toUpperCase() + vendor.kycStatus.slice(1)}
                color={
                  vendor.kycStatus === 'verified'
                    ? 'success'
                    : vendor.kycStatus === 'rejected'
                    ? 'error'
                    : 'warning'
                }
                size="small"
              />
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Bank Information</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Bank Name:</strong> {vendor.bankName}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Account Number:</strong> {vendor.accountNumber}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>IFSC Code:</strong> {vendor.ifscCode}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorDashboard; 