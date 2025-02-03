import { useState } from 'react';
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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

const Deals = () => {
  const [deals, setDeals] = useState([
    {
      id: 1,
      title: 'Flash Sale Bundle',
      description: 'Get 30% off on this amazing bundle',
      image: 'https://via.placeholder.com/300x200',
      originalPrice: 199.99,
      dealPrice: 139.99,
      startDate: '2024-02-01',
      endDate: '2024-02-07',
      status: 'active',
      featured: true,
    },
    {
      id: 2,
      title: 'Weekend Special',
      description: 'Limited time offer on premium products',
      image: 'https://via.placeholder.com/300x200',
      originalPrice: 299.99,
      dealPrice: 249.99,
      startDate: '2024-02-10',
      endDate: '2024-02-12',
      status: 'scheduled',
      featured: false,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    originalPrice: '',
    dealPrice: '',
    startDate: '',
    endDate: '',
    status: 'active',
    featured: false,
  });

  const handleOpen = (deal = null) => {
    if (deal) {
      setEditDeal(deal);
      setFormData(deal);
    } else {
      setEditDeal(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        originalPrice: '',
        dealPrice: '',
        startDate: '',
        endDate: '',
        status: 'active',
        featured: false,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditDeal(null);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editDeal) {
      setDeals(deals.map(d => 
        d.id === editDeal.id ? { ...formData, id: d.id } : d
      ));
    } else {
      setDeals([...deals, { ...formData, id: deals.length + 1 }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setDeals(deals.filter(d => d.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'scheduled':
        return 'warning';
      default:
        return 'default';
    }
  };

  const calculateDiscount = (original, deal) => {
    return Math.round(((original - deal) / original) * 100);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Deals</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Deal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {deals.map((deal) => (
          <Grid item xs={12} sm={6} md={4} key={deal.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={deal.image}
                alt={deal.title}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {deal.title}
                  </Typography>
                  <Chip
                    label={deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                    color={getStatusColor(deal.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {deal.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h5" component="div" color="primary">
                      ${deal.dealPrice}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      ${deal.originalPrice}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${calculateDiscount(deal.originalPrice, deal.dealPrice)}% OFF`}
                    color="error"
                    size="small"
                  />
                </Box>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton onClick={() => handleOpen(deal)} color="primary" size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(deal.id)} color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editDeal ? 'Edit Deal' : 'Add Deal'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Original Price"
              name="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Deal Price"
              name="dealPrice"
              type="number"
              value={formData.dealPrice}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
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
                <MenuItem value="scheduled">Scheduled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editDeal ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Deals; 