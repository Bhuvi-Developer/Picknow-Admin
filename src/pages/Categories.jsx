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
  Grid,
  Chip,
  Avatar,
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
import '../styles/Categories.css';

const compressImage = (base64String) => {
  if (typeof base64String !== 'string' || !base64String.startsWith('data:image')) {
    return base64String;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

const Categories = ({ onCategoryUpdate }) => {
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : [
      { 
        id: 1, 
        name: 'Electronics', 
        description: 'Electronic devices and accessories', 
        image: 'https://source.unsplash.com/100x100/?electronics',
        status: 'active',
        productCount: 150 
      },
      { 
        id: 2, 
        name: 'Clothing', 
        description: 'Fashion and apparel', 
        image: 'https://source.unsplash.com/100x100/?clothing',
        status: 'active',
        productCount: 300 
      },
      {
        id: 3,
        name: 'Home & Kitchen',
        description: 'Home appliances and kitchen essentials',
        image: 'https://source.unsplash.com/100x100/?kitchen',
        status: 'active',
        productCount: 200
      },
      {
        id: 4,
        name: 'Books',
        description: 'Books, magazines and educational materials',
        image: 'https://source.unsplash.com/100x100/?books',
        status: 'active',
        productCount: 400
      },
      {
        id: 5,
        name: 'Sports & Fitness',
        description: 'Sports equipment and fitness gear',
        image: 'https://source.unsplash.com/100x100/?sports',
        status: 'active',
        productCount: 120
      },
      {
        id: 6,
        name: 'Beauty & Personal Care',
        description: 'Beauty products and personal care items',
        image: 'https://source.unsplash.com/100x100/?beauty',
        status: 'active',
        productCount: 250
      }
    ];
  });

  useEffect(() => {
    try {
      const categoriesToStore = categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        status: category.status,
        productCount: category.productCount,
        image: category.image
      }));

      const limitedCategories = categoriesToStore.slice(-20);

      localStorage.setItem('categories', JSON.stringify(limitedCategories));
      
      if (onCategoryUpdate) {
        onCategoryUpdate(categories);
      }
    } catch (error) {
      console.error('Error saving categories:', error);
      if (error.name === 'QuotaExceededError') {
        const reducedCategories = categories.slice(-10);
        try {
          localStorage.setItem('categories', JSON.stringify(reducedCategories));
        } catch (e) {
          console.error('Failed to save even with reduced categories');
        }
      }
    }
  }, [categories, onCategoryUpdate]);

  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'active'
  });
  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOpen = (category = null) => {
    if (category) {
      setEditCategory(category);
      setFormData(category);
      setPreviewImage(category.image);
    } else {
      setEditCategory(null);
      setFormData({ 
        name: '', 
        description: '', 
        image: '',
        status: 'active'
      });
      setPreviewImage('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCategory(null);
    setPreviewImage('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image) newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editCategory) {
        const updatedCategories = categories.map(c => 
          c.id === editCategory.id ? { ...formData, id: c.id, productCount: c.productCount } : c
        );
        setCategories(updatedCategories);
      } else {
        const newCategory = {
          ...formData,
          id: Date.now(),
          productCount: 0
        };
        setCategories([...categories, newCategory]);
      }

      if (onCategoryUpdate) {
        onCategoryUpdate(categories);
      }
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save category. Please try again.'
      }));
    }
  };

  const handleDelete = (id) => {
    const updatedCategories = categories.filter(c => c.id !== id);
    setCategories(updatedCategories);
    if (onCategoryUpdate) {
      onCategoryUpdate(updatedCategories);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
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
        const imageUrl = reader.result;
        setPreviewImage(imageUrl);
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));
        setErrors(prev => ({ ...prev, image: undefined }));
      };
      reader.readAsDataURL(file);
    }
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
      [name]: undefined
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="categories-container">
      <div className="categories-header">
        <div className="categories-title-btn">
            <Typography className="categories-title">
            Categories
            </Typography>
            <Button
                className="add-category-btn"
                variant="contained"
                onClick={() => {
                  setEditCategory(null);
                  handleOpen();
                }}
                startIcon={<AddIcon />}
            >
                Add Category
            </Button>
        </div>
        <div className="search-add-container">
          <div className="search-container">
            <TextField
              className="search-field"
              placeholder="Search categories..."
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
        </div>
      </div>

      <TableContainer className="table-container">
        <Table>
          <TableHead className="table-header">
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((category) => (
                <TableRow key={category.id} className="category-row">
                  <TableCell className="category-cell">
                    <div className="category-info">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="category-image"
                      />
                      <div className="category-details">
                        <Typography className="category-name">
                          {category.name}
                        </Typography>
                        <Typography className="category-description">
                          {category.description}
                        </Typography>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="category-cell">
                    <Typography className="category-description">
                      {category.description}
                    </Typography>
                  </TableCell>
                  <TableCell className="category-cell">
                    <div className={`status-chip ${category.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                      {category.status === 'active' ? (
                        <CheckCircleIcon fontSize="small" />
                      ) : (
                        <CancelIcon fontSize="small" />
                      )}
                      {category.status}
                    </div>
                  </TableCell>
                  <TableCell className="category-cell">
                    <Typography className="category-products">
                      {category.productCount} products
                    </Typography>
                  </TableCell>
                  <TableCell className="category-cell">
                    <div className="action-buttons">
                      <IconButton
                        className="action-button"
                        onClick={() => handleOpen(category)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        className="action-button"
                        onClick={() => handleDelete(category.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredCategories.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
          className="pagination-container"
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="dialog-title">
          {editCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <div 
            className="image-upload-container"
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <>
                <CloudUploadIcon className="image-upload-icon" />
                <Typography className="image-upload-text">
                  Click to upload image
                </Typography>
              </>
            )}
            {errors.image && (
              <Typography className="error-text">{errors.image}</Typography>
            )}
          </div>

          <div className="form-field">
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </div>

          <div className="form-field">
            <TextField
              label="Description"
              name="description"
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </div>

          <div className="form-field">
            <FormControl fullWidth>
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
          </div>

          {errors.submit && (
            <Typography className="error-text" style={{marginTop: '1rem'}}>
              {errors.submit}
            </Typography>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button
            onClick={handleClose}
            className="dialog-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="dialog-button"
            color="primary"
          >
            {editCategory ? 'Update Category' : 'Add Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Categories;