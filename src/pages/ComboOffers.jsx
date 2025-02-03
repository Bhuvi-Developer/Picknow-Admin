import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../styles/ComboOffers.css';

const compressImage = (base64String, maxWidth = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

const safeSetLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${error.message}`);
    return false;
  }
};

const ComboOffers = () => {
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem('products');
      return savedProducts ? JSON.parse(savedProducts) : [];
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  });

  const [comboOffers, setComboOffers] = useState(() => {
    try {
      const savedCombos = localStorage.getItem('comboOffers');
      return savedCombos ? JSON.parse(savedCombos) : [];
    } catch (error) {
      console.error('Error loading combo offers:', error);
      return [];
    }
  });

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editCombo, setEditCombo] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount: '',
    status: 'active',
    image: ''
  });
  const [errors, setErrors] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [comboToDelete, setComboToDelete] = useState(null);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [comboToEdit, setComboToEdit] = useState(null);

  useEffect(() => {
    if (comboOffers.length > 0) {
      const success = safeSetLocalStorage('comboOffers', comboOffers);
      if (!success) {
        const strippedOffers = comboOffers.map(offer => ({
          ...offer,
          image: null,
          products: offer.products.map(p => ({...p, image1: null}))
        }));
        safeSetLocalStorage('comboOffers', strippedOffers);
      }
    }
  }, [comboOffers]);

  // Add effect to fetch products if not available
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        localStorage.setItem('products', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (products.length === 0) {
      fetchProducts();
    }
  }, []);

  const handleOpen = (combo = null) => {
    if (combo) {
      setEditCombo(combo);
      setFormData({
        name: combo.name,
        description: combo.description,
        discount: combo.discount.toString(),
        status: combo.status,
        image: combo.image || ''
      });
      setPreviewImage(combo.image || '');
      setSelectedProducts(combo.products);
    } else {
      setEditCombo(null);
      setFormData({
        name: '',
        description: '',
        discount: '',
        status: 'active',
        image: ''
      });
      setPreviewImage('');
      setSelectedProducts([]);
    }
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCombo(null);
    setSelectedProducts([]);
    setPreviewImage('');
    setFormData({
      name: '',
      description: '',
      discount: '',
      status: 'active',
      image: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.discount) {
      newErrors.discount = 'Discount is required';
    } else if (isNaN(formData.discount) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100) {
      newErrors.discount = 'Discount must be between 0 and 100';
    }
    if (selectedProducts.length < 2) {
      newErrors.products = 'Select at least 2 products for combo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const compressedImage = await compressImage(reader.result);
          setPreviewImage(compressedImage);
          setFormData(prev => ({
            ...prev,
            image: compressedImage
          }));
          setErrors(prev => ({ ...prev, image: undefined }));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing image:', error);
        setErrors(prev => ({
          ...prev,
          image: 'Failed to process image. Please try again.'
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
    const comboData = {
      ...formData,
      discount: parseFloat(formData.discount) || 0,
      products: selectedProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price),
        image1: p.image1
      })),
      totalPrice: calculateTotalPrice(),
      finalPrice: calculateFinalPrice(),
      image: previewImage || formData.image || 'https://via.placeholder.com/100'
    };

      if (editCombo) {
        setComboOffers(prevCombos => 
          prevCombos.map(combo => 
            combo.id === editCombo.id ? { ...comboData, id: combo.id } : combo
          )
        );
      } else {
        setComboOffers(prevCombos => [...prevCombos, {
          ...comboData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        }]);
      }

      handleClose();
    } catch (error) {
      console.error('Error saving combo offer:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save combo offer. Please try again.'
      }));
    }
  };

  const handleProductSelect = (event, newValue) => {
    if (newValue) {
      if (!selectedProducts.find(p => p.id === newValue.id)) {
        setSelectedProducts([...selectedProducts, newValue]);
      }
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleDeleteClick = (combo) => {
    setComboToDelete(combo);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (comboToDelete) {
      setComboOffers(comboOffers.filter(combo => combo.id !== comboToDelete.id));
      setDeleteConfirmOpen(false);
      setComboToDelete(null);
    }
  };

  const handleEditClick = (combo) => {
    setComboToEdit(combo);
    setEditConfirmOpen(true);
  };

  const handleConfirmEdit = () => {
    if (comboToEdit) {
      handleOpen(comboToEdit);
      setEditConfirmOpen(false);
      setComboToEdit(null);
    }
  };

  const handleDelete = (id) => {
    const combo = comboOffers.find(c => c.id === id);
    handleDeleteClick(combo);
  };

  const calculateTotalPrice = () => {
    return selectedProducts.reduce((sum, product) => sum + parseFloat(product.price), 0);
  };

  const calculateFinalPrice = () => {
    const total = calculateTotalPrice();
    const discount = parseFloat(formData.discount) || 0;
    return total - (total * (discount / 100));
  };

  const filteredComboOffers = comboOffers.filter(combo => 
    combo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    combo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="combo-offers-container">
      <Box className="combo-offers-header">
        <Typography variant="h4">Combo Offers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Create Combo Offer
        </Button>
      </Box>

      <Box className="search-container">
        <TextField
          fullWidth
          placeholder="Search combo offers..."
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Combo Image</TableCell>
              <TableCell>Combo Name</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Final Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredComboOffers.map((combo) => (
              <TableRow key={combo.id}>
                <TableCell>
                  <img 
                    src={combo.image || 'https://via.placeholder.com/100'} 
                    alt={combo.name}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">{combo.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {combo.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {combo.products.map(product => (
                      <Chip
                        key={product.id}
                        label={product.name}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>${combo.totalPrice.toFixed(2)}</TableCell>
                <TableCell>{combo.discount}%</TableCell>
                <TableCell>${combo.finalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={combo.status}
                    color={combo.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(combo)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(combo.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editCombo ? 'Edit Combo Offer' : 'Create Combo Offer'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  className="image-upload-container"
                  onClick={() => fileInputRef.current.click()}
                  sx={{
                    height: 200,
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundImage: previewImage ? `url(${previewImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!previewImage && (
                    <Box sx={{ textAlign: 'center' }}>
                      <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                      <Typography color="text.secondary">
                        Click to upload combo image
                      </Typography>
                    </Box>
                  )}
                </Box>
                {errors.image && (
                  <Typography color="error" variant="caption">
                    {errors.image}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Combo Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={products.filter(p => !selectedProducts.find(sp => sp.id === p.id))}
                  getOptionLabel={(option) => `${option.name} - $${option.price}`}
                  onChange={handleProductSelect}
                  value={null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search and select products"
                      variant="outlined"
                      error={!!errors.products}
                      helperText={errors.products}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img 
                          src={option.image1 || 'https://via.placeholder.com/50'} 
                          alt={option.name}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <Box>
                          <Typography variant="subtitle2">{option.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${option.price}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedProducts.map(product => (
                    <Chip
                      key={product.id}
                      label={product.name}
                      onDelete={() => handleRemoveProduct(product.id)}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Discount (%)"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  error={!!errors.discount}
                  helperText={errors.discount}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {selectedProducts.length > 0 && (
              <Box sx={{ mt: 3 }} className="selected-products-summary">
                <Typography variant="h6">Selected Products Summary</Typography>
                <Typography>Total Price: ${calculateTotalPrice().toFixed(2)}</Typography>
                <Typography>Final Price: ${calculateFinalPrice().toFixed(2)}</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editCombo ? 'Update Combo' : 'Create Combo'}
          </Button>
        </DialogActions>
      </Dialog>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the combo offer "{comboToDelete?.name}"?
          </Typography>
          {comboToDelete && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Combo Details:</Typography>
              <Typography>Products: {comboToDelete.products.length}</Typography>
              <Typography>Discount: {comboToDelete.discount}%</Typography>
              <Typography>Final Price: ${comboToDelete.finalPrice?.toFixed(2)}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editConfirmOpen} onClose={() => setEditConfirmOpen(false)}>
        <DialogTitle>Confirm Edit</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to edit the combo offer "{comboToEdit?.name}"?
          </Typography>
          {comboToEdit && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Current Details:</Typography>
              <Typography>Products: {comboToEdit.products.length}</Typography>
              <Typography>Discount: {comboToEdit.discount}%</Typography>
              <Typography>Final Price: ${comboToEdit.finalPrice?.toFixed(2)}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmEdit} variant="contained" color="primary">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComboOffers; 