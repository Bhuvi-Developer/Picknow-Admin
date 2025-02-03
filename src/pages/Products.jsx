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
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InfoIcon from '@mui/icons-material/Info';
import '../styles/Products.css';

const Products = () => {
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : [];
  });

  const [products, setProducts] = useState(() => {
      const savedProducts = localStorage.getItem('products');
      return savedProducts ? JSON.parse(savedProducts) : [
        { 
          id: 1, 
          name: 'Smartphone', 
          shortDescription: 'Latest model smartphone',
          description: 'High-performance smartphone with advanced camera system and long battery life. Features include 5G connectivity, OLED display, and water resistance.',
          category: 'Electronics',
          price: 299.99,
          previousPrice: 399.99,
          quantity: 50,
          offer: 10,
          tax: 5,
          status: 'active',
          images: [
            'https://picsum.photos/150',
            'https://picsum.photos/150',
            'https://picsum.photos/150'
          ],
          grams: 200,
        },
        { 
          id: 2, 
          name: 'T-Shirt', 
          shortDescription: 'Cotton casual t-shirt',
          description: 'Cotton casual t-shirt',
          category: 'Clothing',
          price: 49.99,
          previousPrice: 59.99,
          quantity: 100,
          offer: 0,
          tax: 5,
          status: 'active',
          images: [
            'https://picsum.photos/150',
            'https://picsum.photos/150',
            'https://picsum.photos/150'
          ],
          grams: 150,
        },
      ];
  });

  useEffect(() => {
    const saveProducts = async () => {
      try {
        // Compress images before storing
        const compressedProducts = await Promise.all(products.map(async (product) => {
          const compressedImages = await Promise.all(
            (product.images || []).map(img => compressImage(img))
          );
          return {
            ...product,
            images: compressedImages
          };
        }));

        // Keep only essential data and latest products
        const productsToStore = compressedProducts
          .slice(-10) // Keep only latest 10 products
          .map(product => ({
            id: product.id,
            name: product.name,
            shortDescription: product.shortDescription,
            description: product.description,
            category: product.category,
            price: product.price,
            previousPrice: product.previousPrice,
            quantity: product.quantity,
            offer: product.offer,
            tax: product.tax,
            status: product.status,
            images: product.images,
            grams: product.grams,
          }));

        // Try to store with error handling
        try {
          localStorage.setItem('products', JSON.stringify(productsToStore));
        } catch (storageError) {
          console.warn('Storage quota exceeded, removing oldest products');
          // If still fails, try storing fewer products
          while (productsToStore.length > 0) {
            productsToStore.shift(); // Remove oldest product
            try {
              localStorage.setItem('products', JSON.stringify(productsToStore));
              break;
            } catch (e) {
              if (productsToStore.length === 1) {
                console.error('Cannot store even one product');
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error saving products:', error);
      }
    };

    saveProducts();
  }, [products]);

  useEffect(() => {
    try {
      // Keep only essential category data
      const categoriesToStore = categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        status: category.status,
        // Compress image if it's base64, otherwise keep URL
        image: category.image?.startsWith('data:image') 
          ? compressImage(category.image)
          : category.image
      }));

      // Keep only the latest 20 categories
      const limitedCategories = categoriesToStore.slice(-20);

      try {
        localStorage.setItem('categories', JSON.stringify(limitedCategories));
      } catch (storageError) {
        console.warn('Category storage quota exceeded, removing oldest categories');
        // If storage fails, try with fewer categories
        while (limitedCategories.length > 0) {
          limitedCategories.shift(); // Remove oldest category
          try {
            localStorage.setItem('categories', JSON.stringify(limitedCategories));
            break;
          } catch (e) {
            if (limitedCategories.length === 1) {
              console.error('Cannot store even one category');
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }, [categories]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const imageInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    category: '',
    price: '',
    previousPrice: '',
    quantity: '',
    offer: 0,
    tax: 5,
    status: 'active',
    images: [],
    grams: '',
  });

  const [errors, setErrors] = useState({});

  const [categoryDialog, setCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
    status: 'active'
  });
  const categoryImageRef = useRef(null);
  const [categoryPreviewImage, setCategoryPreviewImage] = useState('');
  const [categoryErrors, setCategoryErrors] = useState({});

  const [searchQuery, setSearchQuery] = useState('');

  const [imagePreviewDialog, setImagePreviewDialog] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (formData.category && !categories.some(cat => cat.name === formData.category)) {
      setFormData(prev => ({
        ...prev,
        category: ''
      }));
    }
  }, [categories, formData.category]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (product = null) => {
    if (product) {
      setEditProduct(product);
      setFormData({
        name: product.name || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price?.toString() || '',
        previousPrice: product.previousPrice?.toString() || '',
        quantity: product.quantity?.toString() || '',
        offer: product.offer || 0,
        tax: product.tax || 5,
        status: product.status || 'active',
        images: product.images || [],
        grams: product.grams?.toString() || '',
      });
      setImagePreviews(product.images || []);
    } else {
      setEditProduct(null);
      setFormData({
        name: '',
        shortDescription: '',
        description: '',
        category: '',
        price: '',
        previousPrice: '',
        quantity: '',
        offer: 0,
        tax: 5,
        status: 'active',
        images: [],
        grams: '',
      });
      setImagePreviews([]);
    }
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditProduct(null);
    setFormData({
      name: '',
      shortDescription: '',
      description: '',
      category: '',
      price: '',
      previousPrice: '',
      quantity: '',
      offer: 0,
      tax: 5,
      status: 'active',
      images: [],
      grams: '',
    });
    setImagePreviews([]);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        previousPrice: parseFloat(formData.previousPrice) || 0,
        quantity: parseInt(formData.quantity) || 0,
        offer: parseFloat(formData.offer) || 0,
        tax: parseFloat(formData.tax) || 0,
        // Use preview images or fallback to form data images
        images: imagePreviews.length > 0 ? imagePreviews : formData.images || [],
      };

      if (editProduct) {
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p.id === editProduct.id ? { ...productData, id: p.id } : p
          )
        );
      } else {
        const newProduct = {
          ...productData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        setProducts(prevProducts => [...prevProducts, newProduct]);
      }

      handleClose();
    } catch (error) {
      console.error('Error submitting product:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit product. Please try again.'
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.description.trim()) newErrors.description = 'Full description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    // Price validation
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    // Quantity validation
    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    
    // Image validation - minimum 3 images required
    if (!formData.images || formData.images.filter(img => img).length < 3) {
      newErrors.images = 'Minimum 3 images are required';
    }

    // Offer and tax validation (optional fields but must be valid if provided)
    if (formData.offer && (isNaN(formData.offer) || parseFloat(formData.offer) < 0 || parseFloat(formData.offer) > 100)) {
      newErrors.offer = 'Offer must be between 0 and 100';
    }
    if (formData.tax && (isNaN(formData.tax) || parseFloat(formData.tax) < 0 || parseFloat(formData.tax) > 100)) {
      newErrors.tax = 'Tax must be between 0 and 100';
    }

    // Grams validation
    if (!formData.grams || isNaN(formData.grams) || parseFloat(formData.grams) <= 0) {
      newErrors.grams = 'Valid weight in grams is required';
    }

    // Previous price validation
    if (!formData.previousPrice || isNaN(formData.previousPrice) || parseFloat(formData.previousPrice) <= 0) {
      newErrors.previousPrice = 'Valid previous price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'out_of_stock':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getFinalPrice = (price, offer, tax) => {
    const discountedPrice = price - (price * (offer / 100));
    const finalPrice = discountedPrice + (discountedPrice * (tax / 100));
    return finalPrice.toFixed(2);
  };

  const compressImage = (base64String) => {
    // If it's not a base64 image, return as is
    if (!base64String?.startsWith('data:image')) {
      return base64String;
    }

    // Create temporary image for compression
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
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
        
        // Compress to JPEG with 0.7 quality
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10000000) { // 10MB limit
        setErrors(prev => ({
          ...prev,
          images: 'Image size should be less than 10MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressedImage = await compressImage(reader.result);
          
          setImagePreviews(prev => {
            const newPreviews = [...prev];
            newPreviews[index] = compressedImage;
            return newPreviews;
          });
          
          setFormData(prev => {
            const newImages = [...(prev.images || [])];
            newImages[index] = compressedImage;
            return {
              ...prev,
              images: newImages
            };
          });
          
          setErrors(prev => ({ ...prev, images: undefined }));
        } catch (error) {
          console.error('Error compressing image:', error);
          setErrors(prev => ({
            ...prev,
            images: 'Error processing image. Please try again.'
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for category selection
    if (name === 'category') {
      if (value === 'add_new_category') {
        setCategoryDialog(true);
        return;
      }
      setFormData(prev => ({
        ...prev,
        category: value
      }));
      setErrors(prev => ({
        ...prev,
        category: undefined
      }));
      return;
    }

    // For all other fields, try to convert to number if possible
    const finalValue = ['price', 'quantity', 'offer', 'tax'].includes(name) 
      ? (value === '' ? '' : Number(value))
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setCategoryErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressedImage = await compressImage(reader.result);
          setCategoryPreviewImage(compressedImage);
          setNewCategory(prev => ({
            ...prev,
            image: compressedImage
          }));
          setCategoryErrors(prev => ({ ...prev, image: undefined }));
        } catch (error) {
          console.error('Error processing category image:', error);
          setCategoryErrors(prev => ({
            ...prev,
            image: 'Error processing image. Please try again.'
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateCategoryForm = () => {
    const errors = {};
    if (!newCategory.name.trim()) errors.name = 'Name is required';
    if (!newCategory.description.trim()) errors.description = 'Description is required';
    if (!newCategory.image) errors.image = 'Image is required';
    setCategoryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddNewCategory = async () => {
    if (!validateCategoryForm()) return;
    
    try {
      let categoryImage = newCategory.image;
      if (categoryImage?.startsWith('data:image')) {
        categoryImage = await compressImage(categoryImage);
      }

      const newCategoryData = {
        ...newCategory,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        productCount: 0,
        image: categoryImage
      };
      
      setCategories(prev => {
        // Keep only latest 20 categories
        const updatedCategories = [...prev, newCategoryData];
        if (updatedCategories.length > 20) {
          return updatedCategories.slice(-20);
        }
        return updatedCategories;
      });
      
      setFormData(prev => ({
        ...prev,
        category: newCategory.name
      }));
      
      setCategoryDialog(false);
      setNewCategory({
        name: '',
        description: '',
        image: '',
        status: 'active'
      });
      setCategoryPreviewImage('');
      setCategoryErrors({});
    } catch (error) {
      console.error('Error adding category:', error);
      setCategoryErrors(prev => ({
        ...prev,
        submit: 'Failed to add category. Please try again.'
      }));
    }
  };

  // Add CSS for proper image display
  const styles = {
    productImage: {
      width: '60px',
      height: '60px',
      objectFit: 'cover',
      borderRadius: '4px',
      border: '1px solid #eee'
    },
    productImages: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    }
  };

  const handleImageClick = (images) => {
    setSelectedImages(images);
    setCurrentImageIndex(0);
    setImagePreviewDialog(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  return (
    <Box className="products-container">
      <Box className="products-header">
        <Typography className="products-title" variant="h4">Products</Typography>
        <Button
          className="add-product-btn"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Product
        </Button>
      </Box>

      <Box className="search-container">
        <TextField
          className="search-field"
          fullWidth
          placeholder="Search products by name, description or category..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper className="table-container">
        <TableContainer>
          <Table>
            <TableHead className="table-header">
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Images</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id} className="product-row">
                    <TableCell className="product-cell">
                      <Box className="product-info">
                        <Box className="product-details">
                          <Typography className="product-name">{product.name}</Typography>
                          <Typography className="product-short-description">
                            {product.shortDescription}
                          </Typography>
                          <Tooltip title={product.description} arrow placement="bottom">
                            <IconButton size="small" sx={{ ml: 1 }}>
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell className="product-cell">
                      <Box sx={styles.productImages}>
                        {(product.images || []).slice(0, 3).map((image, index) => (
                          <Avatar
                            key={index}
                            src={image}
                            alt={`${product.name} - Image ${index + 1}`}
                            variant="rounded"
                            sx={{
                              ...styles.productImage,
                              cursor: 'pointer',
                              '&:hover': {
                                opacity: 0.8,
                                transform: 'scale(1.05)',
                                transition: 'all 0.2s ease-in-out'
                              }
                            }}
                            onClick={() => handleImageClick(product.images)}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell className="product-cell">
                      <Chip className="product-category" label={product.category} size="small" />
                    </TableCell>
                    <TableCell className="product-cell">
                      <Box>
                        <Typography className="product-price" variant="subtitle1" fontWeight="bold">
                          Price: ${product.price}
                        </Typography>
                        <Typography className="original-price" 
                          sx={{ 
                            textDecoration: 'line-through', 
                            color: 'text.secondary',
                            fontSize: '0.875rem'
                          }}>
                          Previous Price: ${product.previousPrice}
                        </Typography>
                        {product.offer > 0 && (
                          <Chip
                            className="discount-badge"
                            label={`${product.offer}% OFF`}
                            color="error"
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell className="product-cell">
                      <Typography variant="body2">
                        {product.quantity} units
                      </Typography>
                    </TableCell>
                    <TableCell className="product-cell">
                      <Chip
                        className={`status-chip status-${product.status}`}
                        label={product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        color={getStatusColor(product.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell className="product-cell">
                      <Box className="action-buttons">
                        <IconButton 
                          className="action-button"
                          onClick={() => handleOpen(product)} 
                          color="primary" 
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          className="action-button"
                          onClick={() => handleDelete(product.id)} 
                          color="error" 
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          className="pagination-container"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle className="dialog-title">
            {editProduct ? 'Edit Product' : 'Add Product'}
          </DialogTitle>
          <DialogContent className="dialog-content">
            <Box className="form-grid">
              <Box className="image-upload-section">
                {[0, 1, 2, 3, 4].map((index) => (
                  <Box
                    key={index}
                    className={`image-upload-container ${errors.images ? 'has-error' : ''}`}
                    onClick={() => imageInputRefs[index].current.click()}
                    sx={{
                      backgroundImage: imagePreviews[index] ? `url(${imagePreviews[index]})` : 'none',
                      opacity: index >= 3 ? 0.7 : 1, // Optional images are slightly faded
                    }}
                  >
                    {!imagePreviews[index] && (
                      <>
                        <CloudUploadIcon className="image-upload-icon" />
                        <Typography className="image-upload-text">
                          {index < 3 ? `Image ${index + 1} (Required)` : `Image ${index + 1} (Optional)`}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
                {errors.images && (
                  <Typography className="error-text" color="error">
                    {errors.images}
                  </Typography>
                )}
              </Box>

              <TextField
                className="form-field"
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
              />

              <TextField
                className="form-field"
                fullWidth
                label="Short Description"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
                error={!!errors.shortDescription}
                helperText={errors.shortDescription || 'Brief summary (max 100 characters)'}
                inputProps={{ maxLength: 100 }}
              />

              <TextField
                className="form-field"
                fullWidth
                label="Full Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
                error={!!errors.description}
                helperText={errors.description || 'Detailed product description'}
              />

              <FormControl className="form-field" fullWidth required error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.length === 0 ? (
                    <MenuItem value="" disabled>No categories available</MenuItem>
                  ) : (
                    categories
                      .filter(category => category.status === 'active')
                      .map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {category.image && (
                              <Avatar
                                src={category.image}
                                alt={category.name}
                                sx={{ width: 24, height: 24 }}
                              />
                            )}
                            <Typography>{category.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))
                  )}
                  <MenuItem 
                    value="add_new_category"
                    sx={{ 
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      color: 'primary.main',
                    }}
                  >
                    <AddCircleOutlineIcon sx={{ mr: 1 }} />
                    Add New Category
                  </MenuItem>
                </Select>
                {errors.category && (
                  <Typography className="error-text">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>

              <TextField
                className="form-field"
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                className="form-field"
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                required
                error={!!errors.quantity}
                helperText={errors.quantity}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                className="form-field"
                fullWidth
                label="Offer (%)"
                name="offer"
                type="number"
                value={formData.offer}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 0, max: 100 }
                }}
              />

              <TextField
                className="form-field"
                fullWidth
                label="Tax (%)"
                name="tax"
                type="number"
                value={formData.tax}
                onChange={handleChange}
                required
                InputProps={{
                  inputProps: { min: 0, max: 100 }
                }}
              />

              <TextField
                className="form-field"
                fullWidth
                label="Weight (grams)"
                name="grams"
                type="number"
                value={formData.grams}
                onChange={handleChange}
                required
                error={!!errors.grams}
                helperText={errors.grams}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />

              <TextField
                className="form-field"
                fullWidth
                label="Previous Price"
                name="previousPrice"
                type="number"
                value={formData.previousPrice}
                onChange={handleChange}
                required
                error={!!errors.previousPrice}
                helperText={errors.previousPrice}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl className="form-field" fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button 
              className="dialog-button" 
              onClick={handleClose} 
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              className="dialog-button"
              type="submit"
              variant="contained"
              disabled={categories.length === 0}
            >
              {editProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog 
        open={categoryDialog} 
        onClose={() => {
          setCategoryDialog(false);
          setCategoryPreviewImage('');
          setNewCategory({
            name: '',
            description: '',
            image: '',
            status: 'active'
          });
          setCategoryErrors({});
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-title">Add New Category</DialogTitle>
        <DialogContent className="dialog-content">
          <Box className="form-grid">
            <Box
              className={`image-upload-container ${categoryErrors.image ? 'has-error' : ''}`}
              onClick={() => categoryImageRef.current.click()}
                sx={{
                  backgroundImage: categoryPreviewImage ? `url(${categoryPreviewImage})` : 'none',
                }}
              >
                {!categoryPreviewImage && (
                  <>
                  <CloudUploadIcon className="image-upload-icon" />
                  <Typography className="image-upload-text">
                      Click to upload image
                    </Typography>
                  </>
                )}
                {categoryErrors.image && (
                <Typography className="error-text">
                    {categoryErrors.image}
                  </Typography>
                )}
            </Box>

            <TextField
              className="form-field"
              fullWidth
              label="Category Name"
              value={newCategory.name}
              onChange={(e) => {
                setNewCategory(prev => ({ ...prev, name: e.target.value }));
                setCategoryErrors(prev => ({ ...prev, name: undefined }));
              }}
              error={!!categoryErrors.name}
              helperText={categoryErrors.name}
              required
            />

            <TextField
              className="form-field"
              fullWidth
              label="Description"
              value={newCategory.description}
              onChange={(e) => {
                setNewCategory(prev => ({ ...prev, description: e.target.value }));
                setCategoryErrors(prev => ({ ...prev, description: undefined }));
              }}
              error={!!categoryErrors.description}
              helperText={categoryErrors.description}
              multiline
              rows={3}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button 
            className="dialog-button"
            onClick={() => {
              setCategoryDialog(false);
              setCategoryPreviewImage('');
              setNewCategory({
                name: '',
                description: '',
                image: '',
                status: 'active'
              });
              setCategoryErrors({});
            }} 
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            className="dialog-button"
            onClick={handleAddNewCategory} 
            variant="contained"
          >
            Add Category
          </Button>
        </DialogActions>
      </Dialog>

      {[0, 1, 2, 3, 4].map((index) => (
        <input
          key={index}
          type="file"
          ref={imageInputRefs[index]}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleImageUpload(e, index)}
        />
      ))}
      <input
        type="file"
        ref={categoryImageRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleCategoryImageUpload}
      />

      <Dialog
        open={imagePreviewDialog}
        onClose={() => setImagePreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', p: 0, bgcolor: 'black' }}>
          {selectedImages.length > 0 && (
            <>
              <img
                src={selectedImages[currentImageIndex]}
                alt={`Product Image ${currentImageIndex + 1}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '80vh',
                  objectFit: 'contain'
                }}
              />
              {selectedImages.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </>
              )}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1
                }}
              >
                {selectedImages.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: index === currentImageIndex ? 'primary.main' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'black', justifyContent: 'center' }}>
          <Button
            onClick={() => setImagePreviewDialog(false)}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products; 