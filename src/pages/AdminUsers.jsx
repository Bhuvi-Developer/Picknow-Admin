import { useState, useEffect } from 'react';
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
  Checkbox,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PERMISSIONS, ACTIONS } from '../constants/permissions';
import usePermissions from '../hooks/usePermissions';

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState(() => {
    const savedUsers = localStorage.getItem('adminUsers');
    return savedUsers ? JSON.parse(savedUsers) : [
      {
        id: '1',
        name: 'Super Admin',
        email: 'admin@example.com',
        role: 'super_admin',
        status: 'active',
        password: 'admin123',
        createdAt: new Date().toISOString(),
        permissions: Object.keys(PERMISSIONS).reduce((acc, key) => ({
          ...acc,
          [PERMISSIONS[key]]: [ACTIONS.READ, ACTIONS.WRITE, ACTIONS.DELETE]
        }), {})
      }
    ];
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { canWrite, canDelete } = usePermissions();

  useEffect(() => {
    localStorage.setItem('adminUsers', JSON.stringify(adminUsers));
  }, [adminUsers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = adminUsers.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'admin',
      status: 'active'
    });
    setErrors({});
    setOpen(true);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      confirmPassword: '',
      role: user.role || 'admin',
      status: user.status || 'active'
    });
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!editUser && adminUsers.some(user => user.email === formData.email)) {
      newErrors.email = 'Email already exists';
    }

    if (!editUser) {
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
    } else if (formData.password) {
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
    
    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...userData } = formData;

    if (editUser) {
      // If no new password is provided, don't update the password
      if (!userData.password) {
        const { password, ...dataWithoutPassword } = userData;
        setAdminUsers(adminUsers.map(user => 
          user.id === editUser.id ? { 
            ...user, 
            ...dataWithoutPassword,
            permissions: user.permissions || getDefaultPermissions(dataWithoutPassword.role)
          } : user
        ));
      } else {
        setAdminUsers(adminUsers.map(user => 
          user.id === editUser.id ? {
            ...user,
            ...userData,
            permissions: user.permissions || getDefaultPermissions(userData.role)
          } : user
        ));
      }
    } else {
      const newUser = { 
        ...userData, 
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        permissions: getDefaultPermissions(userData.role)
      };
      
      setAdminUsers([...adminUsers, newUser]);
      localStorage.setItem('adminUsers', JSON.stringify([...adminUsers, newUser]));
    }
    handleClose();
  };

  // Helper function to get default permissions based on role
  const getDefaultPermissions = (role) => {
    if (role === 'super_admin') {
      return Object.keys(PERMISSIONS).reduce((acc, key) => ({
        ...acc,
        [PERMISSIONS[key]]: [ACTIONS.READ, ACTIONS.WRITE, ACTIONS.DELETE]
      }), {});
    }
    
    // Default permissions for regular admin
    return Object.keys(PERMISSIONS).reduce((acc, key) => ({
      ...acc,
      [PERMISSIONS[key]]: [ACTIONS.READ]
    }), {});
  };

  const handleDelete = (id) => {
    // Prevent deleting the last super admin
    const user = adminUsers.find(u => u.id === id);
    const superAdmins = adminUsers.filter(u => u.role === 'super_admin');
    if (user.role === 'super_admin' && superAdmins.length === 1) {
      alert('Cannot delete the last super admin');
      return;
    }
    setAdminUsers(adminUsers.filter(u => u.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'error';
      case 'admin':
        return 'primary';
      default:
        return 'default';
    }
  };

  const handleSavePermissions = (permissions) => {
    if (!selectedUser || selectedUser.role === 'super_admin') return;

    const updatedUsers = adminUsers.map(user => {
      if (user.id === selectedUser.id) {
        // Ensure all modules have at least an empty array
        const updatedPermissions = Object.keys(PERMISSIONS).reduce((acc, key) => ({
          ...acc,
          [PERMISSIONS[key]]: permissions[PERMISSIONS[key]] || []
        }), {});

        return { ...user, permissions: updatedPermissions };
      }
      return user;
    });
    
    setAdminUsers(updatedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
    setPermissionDialogOpen(false);
  };

  const hasActionPermission = (action, module) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser?.role === 'super_admin') return true;
    return currentUser?.permissions?.[module]?.includes(action) || false;
  };

  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SecurityIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Admin Users
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5, opacity: 0.8 }}>
              Manage administrator accounts and permissions
            </Typography>
          </Box>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <TextField
            placeholder="Search admin users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              minWidth: '200px',
              maxWidth: '400px',
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'inherit',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              },
              '& .MuiInputAdornment-root': {
                color: 'inherit',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={!hasActionPermission(ACTIONS.WRITE, PERMISSIONS.ADMIN_USERS)}
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Add Admin User
          </Button>
        </Box>
      </Paper>

      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow 
                    key={user.id}
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: user.role === 'super_admin' ? 'error.main' : 'primary.main',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {user.role === 'super_admin' ? <SecurityIcon /> : <PersonIcon />}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {user.name}
                            {user.role === 'super_admin' && (
                              <Tooltip title="Super Admin has full access to all features">
                                <LockIcon 
                                  sx={{ 
                                    ml: 1, 
                                    fontSize: 16, 
                                    color: 'error.main',
                                    verticalAlign: 'middle'
                                  }} 
                                />
                              </Tooltip>
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        color={user.status === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSelectedUser(user);
                          setPermissionDialogOpen(true);
                        }}
                        disabled={!hasActionPermission(ACTIONS.WRITE, PERMISSIONS.ADMIN_USERS)}
                      >
                        Manage Permissions
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        onClick={() => handleEdit(user)} 
                        color="primary" 
                        size="small"
                        disabled={!hasActionPermission(ACTIONS.WRITE, PERMISSIONS.ADMIN_USERS)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(user.id)} 
                        color="error" 
                        size="small"
                        disabled={
                          (user.role === 'super_admin' && 
                           adminUsers.filter(u => u.role === 'super_admin').length === 1) ||
                          !hasActionPermission(ACTIONS.DELETE, PERMISSIONS.ADMIN_USERS)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editUser ? 'Edit Admin User' : 'Add Admin User'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
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
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required={!editUser}
              error={!!errors.password}
              helperText={editUser ? 'Leave blank to keep current password' : errors.password}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required={!editUser}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="super_admin">Super Admin</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editUser ? 'Update User' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      <PermissionDialog
        open={permissionDialogOpen}
        onClose={() => setPermissionDialogOpen(false)}
        user={selectedUser}
        onSave={handleSavePermissions}
      />
    </Box>
  );
};

const PermissionDialog = ({ open, onClose, user, onSave }) => {
  const [permissions, setPermissions] = useState(
    user?.role === 'super_admin' 
      ? Object.keys(PERMISSIONS).reduce((acc, key) => ({
          ...acc,
          [PERMISSIONS[key]]: [ACTIONS.READ, ACTIONS.WRITE, ACTIONS.DELETE]
        }), {})
      : (user?.permissions || {})
  );

  // Update permissions when user changes
  useEffect(() => {
    setPermissions(
      user?.role === 'super_admin' 
        ? Object.keys(PERMISSIONS).reduce((acc, key) => ({
            ...acc,
            [PERMISSIONS[key]]: [ACTIONS.READ, ACTIONS.WRITE, ACTIONS.DELETE]
          }), {})
        : (user?.permissions || Object.keys(PERMISSIONS).reduce((acc, key) => ({
            ...acc,
            [PERMISSIONS[key]]: []
          }), {}))
    );
  }, [user]);

  const handlePermissionChange = (module, action) => {
    if (user?.role === 'super_admin') return;

    setPermissions(prev => {
      const newPermissions = { ...prev };
      
      if (!newPermissions[module]) {
        newPermissions[module] = [];
      }

      if (action === ACTIONS.READ) {
        if (newPermissions[module].includes(ACTIONS.READ)) {
          // If removing READ, remove all permissions
          newPermissions[module] = [];
        } else {
          // If adding READ, just add READ
          newPermissions[module] = [ACTIONS.READ];
        }
      } else {
        if (newPermissions[module].includes(action)) {
          // Remove the action
          newPermissions[module] = newPermissions[module].filter(a => a !== action);
        } else {
          // Add the action and ensure READ is included
          if (!newPermissions[module].includes(ACTIONS.READ)) {
            newPermissions[module] = [ACTIONS.READ, action];
          } else {
            newPermissions[module] = [...newPermissions[module], action];
          }
        }
      }

      return newPermissions;
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle sx={{ 
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}>
        <SecurityIcon color="primary" />
        <Box>
          Manage Permissions - {user?.name}
          {user?.role === 'super_admin' && (
            <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
              Super Admin has full access to all features and cannot be modified
            </Typography>
          )}
          {user?.role !== 'super_admin' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Configure access rights for different modules
            </Typography>
          )}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Module</TableCell>
                <TableCell align="center">Read</TableCell>
                <TableCell align="center">Write</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(PERMISSIONS).map((module) => (
                <TableRow key={module}>
                  <TableCell>{module}</TableCell>
                  {Object.values(ACTIONS).map((action) => (
                    <TableCell key={action} align="center">
                      <Checkbox
                        checked={
                          user?.role === 'super_admin' || 
                          permissions[module]?.includes(action) || 
                          false
                        }
                        onChange={() => handlePermissionChange(module, action)}
                        disabled={
                          user?.role === 'super_admin' || 
                          (action !== ACTIONS.READ && !permissions[module]?.includes(ACTIONS.READ))
                        }
                        color={user?.role === 'super_admin' ? 'error' : 'primary'}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => {
            onSave(permissions);
            onClose();
          }}
          variant="contained"
          disabled={user?.role === 'super_admin'}
        >
          Save Permissions
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminUsers; 