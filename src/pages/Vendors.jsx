import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ConfirmationDialog from '../components/ConfirmationDialog';

const Vendors = () => {
  const fileInputRef = useRef(null);
  const [vendors, setVendors] = useState(() => {
    const savedVendors = localStorage.getItem('vendors');
    return savedVendors ? JSON.parse(savedVendors) : [];
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    image: '',
    status: 'active',
    gstNumber: '',
    panNumber: '',
    aadharNumber: '',
    businessLicense: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    kycStatus: 'pending',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  // Add new states for confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: 'confirm',
    title: '',
    content: '',
    details: null,
    onConfirm: () => {}
  });
  
  const [successDialog, setSuccessDialog] = useState({
    open: false,
    title: '',
    content: ''
  });

  useEffect(() => {
    localStorage.setItem('vendors', JSON.stringify(vendors));
  }, [vendors]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredVendors = vendors.filter(vendor => 
    vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear the error for this field
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handleAdd = () => {
    setEditVendor(null);
    setFormData({
      name: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      image: '',
      status: 'active',
      gstNumber: '',
      panNumber: '',
      aadharNumber: '',
      businessLicense: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      kycStatus: 'pending',
      password: '',
      confirmPassword: ''
    });
    setPreviewImage('');
    setErrors({});
    setOpen(true);  // This opens the dialog
  };

  const handleEdit = (vendor) => {
    setConfirmDialog({
      open: true,
      type: 'confirm',
      title: 'Confirm Edit',
      content: `Are you sure you want to edit vendor "${vendor.name}"?`,
      details: {
        Email: vendor.email,
        Phone: vendor.phone,
        Status: vendor.status,
        'KYC Status': vendor.kycStatus
      },
      onConfirm: () => {
    setEditVendor(vendor);
    setFormData({
      name: vendor.name || '',
      description: vendor.description || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      address: vendor.address || '',
      image: vendor.image || '',
      status: vendor.status || 'active',
      gstNumber: vendor.gstNumber || '',
      panNumber: vendor.panNumber || '',
      aadharNumber: vendor.aadharNumber || '',
      businessLicense: vendor.businessLicense || '',
      bankName: vendor.bankName || '',
      accountNumber: vendor.accountNumber || '',
      ifscCode: vendor.ifscCode || '',
      kycStatus: vendor.kycStatus || 'pending',
      password: '',
      confirmPassword: ''
    });
    setPreviewImage(vendor.image || '');
    setErrors({});
    setOpen(true);
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditVendor(null);
    setPreviewImage('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = 'GST Number is required';
    } else if (!gstRegex.test(formData.gstNumber)) {
      newErrors.gstNumber = 'Please enter a valid GST Number';
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!formData.panNumber.trim()) {
      newErrors.panNumber = 'PAN Number is required';
    } else if (!panRegex.test(formData.panNumber)) {
      newErrors.panNumber = 'Please enter a valid PAN Number';
    }

    const aadharRegex = /^[0-9]{12}$/;
    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar Number is required';
    } else if (!aadharRegex.test(formData.aadharNumber.replace(/[^0-9]/g, ''))) {
      newErrors.aadharNumber = 'Please enter a valid 12-digit Aadhar Number';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank Name is required';
    }

    const accountRegex = /^[0-9]{9,18}$/;
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account Number is required';
    } else if (!accountRegex.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Please enter a valid Account Number';
    }

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC Code is required';
    } else if (!ifscRegex.test(formData.ifscCode)) {
      newErrors.ifscCode = 'Please enter a valid IFSC Code';
    }

    if (!formData.businessLicense.trim()) {
      newErrors.businessLicense = 'Business License Number is required';
    }

    if (!formData.image) {
      newErrors.image = 'Image is required';
    }

    // Password validation for new vendors
    if (!editVendor) {
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Only validate password fields if they are provided during edit
    if (editVendor && (formData.password || formData.confirmPassword)) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validate the form first
    if (!validateForm()) return;
  
    try {
      const vendorData = {
        ...formData,
        image: previewImage || formData.image, // Use previewImage if available, otherwise fallback to formData.image
      };
  
      // Check if you're editing an existing vendor or adding a new one
      if (editVendor) {
        setVendors((prevVendors) =>
          prevVendors.map((vendor) =>
            vendor.id === editVendor.id
              ? { ...vendorData, id: vendor.id } // Update the existing vendor with new data
              : vendor
          )
        );
        setSuccessDialog({
          open: true,
          type: 'success',
          title: 'Vendor Updated',
          content: 'The vendor has been successfully updated.',
        });
      } else {
        setVendors((prevVendors) => [
          ...prevVendors,
          {
            ...vendorData,
            id: Date.now(), // Unique ID for the new vendor
            createdAt: new Date().toISOString(), // Timestamp of when the vendor is created
          },
        ]);
        setSuccessDialog({
          open: true,
          type: 'success',
          title: 'Vendor Created',
          content: 'The vendor has been successfully created.',
        });
      }
  
      // Close the dialog after successful save
      handleClose();
  
    } catch (error) {
      console.error('Error saving vendor:', error);
  
      // Update the error state if something goes wrong
      setErrors((prev) => ({
        ...prev,
        submit: 'Failed to save vendor. Please try again.',
      }));
    }
  };
  

  const handleDelete = (id) => {
    const vendor = vendors.find(v => v.id === id);
    setConfirmDialog({
      open: true,
      type: 'delete',
      title: 'Confirm Delete',
      content: `Are you sure you want to delete vendor "${vendor.name}"?`,
      details: {
        Email: vendor.email,
        Phone: vendor.phone,
        Status: vendor.status,
        'KYC Status': vendor.kycStatus
      },
      onConfirm: () => {
        setVendors(vendors.filter(v => v.id !== id));
        setConfirmDialog(prev => ({ ...prev, open: false }));
        setSuccessDialog({
          open: true,
          type: 'success',
          title: 'Vendor Deleted',
          content: 'The vendor has been successfully deleted.'
        });
      }
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
        setErrors(prev => ({ ...prev, image: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Vendors</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          type="button"
        >
          Add Vendor
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search vendors by name, email, phone or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVendors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={vendor.image}
                          alt={vendor.name}
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        />
                        <Box>
                          <Typography variant="subtitle2">{vendor.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {vendor.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{vendor.email}</Typography>
                      <Typography variant="body2">{vendor.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{vendor.address}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                        color={vendor.status === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(vendor)} color="primary" size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(vendor.id)} color="error" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredVendors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editVendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  border: errors.image ? '2px dashed #f44336' : '2px dashed #ccc',
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundImage: previewImage ? `url(${previewImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
                onClick={() => fileInputRef.current.click()}
              >
                {!previewImage && (
                  <>
                    <CloudUploadIcon sx={{ fontSize: 40, color: errors.image ? '#f44336' : 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color={errors.image ? '#f44336' : 'text.secondary'}>
                      Click to upload image
                    </Typography>
                  </>
                )}
                {errors.image && (
                  <Typography color="error" variant="caption" sx={{ position: 'absolute', bottom: 4 }}>
                    {errors.image}
                  </Typography>
                )}
              </Box>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </Box>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />

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
            />

            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.phone}
              helperText={errors.phone}
            />

            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>KYC Information</Typography>
            
            <TextField
              fullWidth
              label="GST Number"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.gstNumber}
              helperText={errors.gstNumber}
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />

            <TextField
              fullWidth
              label="PAN Number"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.panNumber}
              helperText={errors.panNumber}
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />

            <TextField
              fullWidth
              label="Aadhar Number"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.aadharNumber}
              helperText={errors.aadharNumber}
            />

            <TextField
              fullWidth
              label="Business License Number"
              name="businessLicense"
              value={formData.businessLicense}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.businessLicense}
              helperText={errors.businessLicense}
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Security</Typography>

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required={!editVendor}
              error={!!errors.password}
              helperText={editVendor ? 'Leave blank to keep current password' : errors.password}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required={!editVendor}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Bank Details</Typography>

            <TextField
              fullWidth
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.bankName}
              helperText={errors.bankName}
            />

            <TextField
              fullWidth
              label="Account Number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.accountNumber}
              helperText={errors.accountNumber}
            />
         
            <TextField
              fullWidth
              label="IFSC Code"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.ifscCode}
              helperText={errors.ifscCode}
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>KYC Status</InputLabel>
              <Select
                name="kycStatus"
                value={formData.kycStatus}
                onChange={handleChange}
                label="KYC Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editVendor ? 'Update Vendor' : 'Add Vendor'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        content={confirmDialog.content}
        type={confirmDialog.type}
        details={confirmDialog.details}
      />

      {/* Add Success Dialog */}
      <ConfirmationDialog
        open={successDialog.open}
        onClose={() => setSuccessDialog(prev => ({ ...prev, open: false }))}
        onConfirm={() => setSuccessDialog(prev => ({ ...prev, open: false }))}
        title={successDialog.title}
        content={successDialog.content}
        type="success"
        confirmText="OK"
      />
    </Box>
  );
};

export default Vendors; 