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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Offers = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: 'Summer Sale',
      description: '20% off on all summer items',
      discountType: 'percentage',
      discountValue: 20,
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      status: 'active',
    },
    {
      id: 2,
      title: 'Welcome Discount',
      description: 'Flat $10 off on first purchase',
      discountType: 'fixed',
      discountValue: 10,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    status: 'active',
  });

  const handleOpen = (offer = null) => {
    if (offer) {
      setEditOffer(offer);
      setFormData(offer);
    } else {
      setEditOffer(null);
      setFormData({
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        startDate: '',
        endDate: '',
        status: 'active',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditOffer(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editOffer) {
      setOffers(offers.map(o => 
        o.id === editOffer.id ? { ...formData, id: o.id } : o
      ));
    } else {
      setOffers([...offers, { ...formData, id: offers.length + 1 }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setOffers(offers.filter(o => o.id !== id));
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Offers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Offer
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell>{offer.id}</TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{offer.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {offer.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  {offer.discountType === 'percentage' 
                    ? `${offer.discountValue}%` 
                    : `$${offer.discountValue}`}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(offer.startDate).toLocaleDateString()} -
                    <br />
                    {new Date(offer.endDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    color={getStatusColor(offer.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(offer)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(offer.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editOffer ? 'Edit Offer' : 'Add Offer'}</DialogTitle>
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Discount Type</InputLabel>
              <Select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                label="Discount Type"
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Discount Value"
              name="discountValue"
              type="number"
              value={formData.discountValue}
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
            {editOffer ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Offers; 