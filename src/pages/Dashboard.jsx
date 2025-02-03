import { Box, Grid, Paper, Typography, useTheme, Tab, Tabs, Button, IconButton, Menu, MenuItem, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, LinearProgress, CircularProgress, Card, CardContent, Stack, Chip, Tooltip, Link, Select } from '@mui/material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import Badge from '@mui/material/Badge';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const Dashboard = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [statCardAnchorEl, setStatCardAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCalendarClick = (event) => {
    event.stopPropagation();
    setCalendarAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event) => {
    event.stopPropagation();
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleStatCardClick = (event, cardId) => {
    event.stopPropagation();
    setStatCardAnchorEl({ element: event.currentTarget, id: cardId });
  };

  const handleCloseAll = () => {
    setCalendarAnchorEl(null);
    setNotificationAnchorEl(null);
    setStatCardAnchorEl(null);
  };

  // Enhanced sales data with more points
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Sales 2023',
      data: [1200000, 1900000, 1500000, 2500000, 2200000, 3000000, 2800000, 3200000, 3500000, 3100000, 3800000, 4200000],
      borderColor: theme.palette.primary.main,
      backgroundColor: `${theme.palette.primary.main}15`,
      tension: 0.4,
    }, {
      label: 'Sales 2022',
      data: [1000000, 1500000, 1300000, 2000000, 1800000, 2500000, 2300000, 2700000, 2900000, 2600000, 3100000, 3500000],
      borderColor: theme.palette.grey[400],
      backgroundColor: 'transparent',
      tension: 0.4,
      borderDash: [5, 5],
    }],
  };

  // Category distribution data
  const categoryData = {
    labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Others'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.error.main,
      ],
    }],
  };

  // Revenue by product data
  const revenueData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    datasets: [{
      label: 'Revenue',
      data: [450000, 350000, 300000, 250000, 200000],
      backgroundColor: theme.palette.primary.main,
    }],
  };

  // Enhanced chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#333',
        bodyColor: '#666',
        bodyFont: {
          size: 13,
        },
        borderColor: '#e0e0e0',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatINR(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          callback: (value) => formatINR(value),
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const StatCard = ({ id, title, value, description, change, icon: Icon, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        height: '100%',
        borderRadius: 2,
        backgroundColor: '#fff',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          '& .stat-menu': {
            opacity: 1,
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          backgroundColor: color || theme.palette.primary.main,
        },
      }}
    >
      <Box 
        className="stat-menu"
        sx={{ 
          position: 'absolute', 
          right: 8, 
          top: 8,
          opacity: 0,
          transition: 'opacity 0.2s ease',
          zIndex: 1,
        }}
      >
        <IconButton 
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleStatCardClick(e, id);
          }}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body1" color="text.secondary" gutterBottom>
        {title}
      </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color || theme.palette.primary.main}15`,
            p: 1,
            borderRadius: 2,
            color: color || theme.palette.primary.main,
          }}
        >
          <Icon />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: change >= 0 ? 'success.main' : 'error.main',
            fontWeight: 500,
            mr: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ShowChartIcon sx={{ fontSize: 16, mr: 0.5 }} />
          {change >= 0 ? '+' : ''}{change}%
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      </Box>
    </Paper>
  );

  const TopProductsTable = () => {
    const products = [
      { 
        id: 1, 
        name: 'iPhone 13 Pro', 
        image: 'https://source.unsplash.com/50x50/?iphone',
        sales: 2345600,
        orders: 234,
        trend: 12.5,
        stock: 75
      },
      { 
        id: 2, 
        name: 'Samsung TV', 
        image: 'https://source.unsplash.com/50x50/?tv',
        sales: 1845600,
        orders: 156,
        trend: -5.2,
        stock: 50
      },
      { 
        id: 3, 
        name: 'MacBook Pro', 
        image: 'https://source.unsplash.com/50x50/?laptop',
        sales: 1645600,
        orders: 145,
        trend: 8.7,
        stock: 60
      },
      { 
        id: 4, 
        name: 'AirPods Pro', 
        image: 'https://source.unsplash.com/50x50/?earphones',
        sales: 945600,
        orders: 189,
        trend: 15.8,
        stock: 40
      },
    ];

    return (
      <TableContainer sx={{ minWidth: 650 }}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: { xs: 1, md: 2 } }}>Product</TableCell>
              <TableCell align="right">Sales</TableCell>
              <TableCell align="right">Orders</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right" sx={{ pr: { xs: 1, md: 2 } }}>Trend</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell sx={{ pl: { xs: 1, md: 2 } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 1, md: 2 }
                  }}>
                    <Avatar 
                      src={product.image} 
                      variant="rounded"
                      sx={{ width: { xs: 40, md: 50 }, height: { xs: 40, md: 50 } }}
                    />
                    <Typography variant="body2">{product.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{formatINR(product.sales)}</TableCell>
                <TableCell align="right">{product.orders}</TableCell>
                <TableCell align="right">
                  <Chip 
                    label={product.stock > 50 ? 'In Stock' : 'Low Stock'} 
                    color={product.stock > 50 ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right" sx={{ pr: { xs: 1, md: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                    {product.trend > 0 ? (
                      <ArrowUpwardIcon color="success" sx={{ fontSize: 16 }} />
                    ) : (
                      <ArrowDownwardIcon color="error" sx={{ fontSize: 16 }} />
                    )}
                    <Typography
                      variant="body2"
                      color={product.trend > 0 ? 'success.main' : 'error.main'}
                    >
                      {Math.abs(product.trend)}%
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const CategoryProgress = () => {
    const categories = [
      { name: 'Electronics', value: 85, color: 'primary.main' },
      { name: 'Fashion', value: 65, color: 'secondary.main' },
      { name: 'Home & Living', value: 45, color: 'success.main' },
      { name: 'Books', value: 35, color: 'warning.main' },
    ];

  return (
      <Box>
        {categories.map((category) => (
          <Box key={category.name} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{category.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {category.value}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={category.value}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: `${category.color}22`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: category.color,
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        ))}
      </Box>
    );
  };

  const DashboardHeader = ({ timeRange, setTimeRange, handleMenuClick }) => (
    <Box sx={{ mb: { xs: 2, md: 3 } }}>
      {/* Top Bar */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', md: 'center' },
        gap: { xs: 2, md: 0 },
        mb: { xs: 2, md: 3 }
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Welcome back! Here's what's happening with your store today.
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', md: 'flex-end' }
        }}>
          <IconButton onClick={handleCalendarClick}>
            <CalendarTodayIcon />
          </IconButton>
          <IconButton onClick={handleNotificationClick}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button 
            variant="outlined" 
            startIcon={<FileDownloadIcon />}
            sx={{ 
              '&:focus': { outline: 'none' },
              flex: { xs: 1, md: 'none' }
            }}
          >
            Export Report
          </Button>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Time Range Tabs */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'flex-start',
        mb: { xs: 2, md: 3 }
      }}>
        <Tabs 
          value={timeRange} 
          onChange={(e, newValue) => setTimeRange(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            minHeight: 'auto',
            '& .MuiTab-root': { 
              minHeight: 'auto',
              py: 1,
              px: 2,
              minWidth: 'auto',
              '&:focus': { outline: 'none' },
            },
          }}
        >
          <Tab label="Today" />
          <Tab label="Week" />
          <Tab label="Month" />
          <Tab label="Year" />
        </Tabs>
      </Box>
    </Box>
  );

  const DashboardMenus = ({ anchorEl, handleMenuClose }) => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      PaperProps={{
        elevation: 2,
        sx: {
          mt: 1,
          minWidth: 200,
        },
      }}
    >
      <MenuItem onClick={handleMenuClose}>
        <RefreshIcon sx={{ mr: 2, fontSize: 20 }} />
        Refresh Data
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <TimelineIcon sx={{ mr: 2, fontSize: 20 }} />
        View Analytics
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <FileDownloadIcon sx={{ mr: 2, fontSize: 20 }} />
        Download Report
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleMenuClose}>
        <PieChartIcon sx={{ mr: 2, fontSize: 20 }} />
        Advanced Analytics
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <MoreHorizIcon sx={{ mr: 2, fontSize: 20 }} />
        Settings
      </MenuItem>
    </Menu>
  );

  const NotificationsMenu = ({ anchorEl, onClose }) => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      PaperProps={{
        elevation: 2,
        sx: { 
          mt: 1,
          width: 320,
          maxHeight: 400,
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
          Notifications
        </Typography>
      </Box>
      {/* Add notification items here */}
    </Menu>
  );

  const StatCardMenu = ({ anchorEl, onClose }) => (
    <Menu
      anchorEl={anchorEl?.element}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      PaperProps={{
        elevation: 2,
        sx: { 
          mt: 0.5,
          minWidth: 200,
        },
      }}
    >
      <MenuItem onClick={onClose}>
        <VisibilityIcon sx={{ mr: 2, fontSize: 20 }} />
        View Details
      </MenuItem>
      <MenuItem onClick={onClose}>
        <GetAppIcon sx={{ mr: 2, fontSize: 20 }} />
        Download Report
      </MenuItem>
      <MenuItem onClick={onClose}>
        <PrintIcon sx={{ mr: 2, fontSize: 20 }} />
        Print
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClose}>
        <ShareIcon sx={{ mr: 2, fontSize: 20 }} />
        Share
      </MenuItem>
    </Menu>
  );

  const QuickActions = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Quick Actions
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Card sx={{ flex: 1, cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <InventoryIcon color="primary" />
              <Box>
                <Typography variant="subtitle2">Add New Product</Typography>
                <Typography variant="caption" color="text.secondary">
                  Create a new product listing
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <StorefrontIcon color="secondary" />
              <Box>
                <Typography variant="subtitle2">Manage Orders</Typography>
                <Typography variant="caption" color="text.secondary">
                  View and process orders
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <GroupIcon color="success" />
              <Box>
                <Typography variant="subtitle2">Customer Support</Typography>
                <Typography variant="caption" color="text.secondary">
                  Handle customer inquiries
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );

  const RecentActivities = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Recent Activities
        </Typography>
        <Stack spacing={2}>
          {[
            {
              action: 'New order received',
              details: 'Order #12345 from John Doe',
              time: '2 minutes ago',
              type: 'order'
            },
            {
              action: 'Payment processed',
              details: 'Payment for Order #12342',
              time: '5 minutes ago',
              type: 'payment'
            },
            {
              action: 'Product updated',
              details: 'iPhone 13 Pro stock updated',
              time: '10 minutes ago',
              type: 'product'
            }
          ].map((activity, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={10}
                sx={{ 
                  mt: 1,
                  color: activity.type === 'order' 
                    ? 'success.main' 
                    : activity.type === 'payment' 
                    ? 'primary.main' 
                    : 'secondary.main'
                }}
              />
              <Box>
                <Typography variant="subtitle2">{activity.action}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {activity.details}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activity.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  const TopCustomers = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Top Customers
          </Typography>
          <Button size="small" endIcon={<ArrowForwardIcon />}>
            View All
          </Button>
        </Box>
        <Stack spacing={2}>
          {[
            {
              name: 'John Doe',
              email: 'john@example.com',
              orders: 45,
              spent: 125000,
              avatar: 'https://source.unsplash.com/50x50/?portrait,man'
            },
            {
              name: 'Jane Smith',
              email: 'jane@example.com',
              orders: 32,
              spent: 98000,
              avatar: 'https://source.unsplash.com/50x50/?portrait,woman'
            },
            {
              name: 'Mike Johnson',
              email: 'mike@example.com',
              orders: 28,
              spent: 85000,
              avatar: 'https://source.unsplash.com/50x50/?portrait'
            }
          ].map((customer, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.default',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={customer.avatar} />
                <Box>
                  <Typography variant="subtitle2">{customer.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {customer.email}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2">{formatINR(customer.spent)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {customer.orders} orders
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  const SalesByLocation = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Sales by Location
          </Typography>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Stack spacing={2}>
          {[
            { location: 'Mumbai', sales: 1245600, percentage: 35 },
            { location: 'Delhi', sales: 985000, percentage: 28 },
            { location: 'Bangalore', sales: 754000, percentage: 21 },
            { location: 'Chennai', sales: 562000, percentage: 16 }
          ].map((item) => (
            <Box key={item.location}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">{item.location}</Typography>
                <Typography variant="body2">{formatINR(item.sales)}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.percentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: `${theme.palette.primary.main}15`,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );


  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
      <DashboardHeader 
        timeRange={timeRange} 
        setTimeRange={setTimeRange}
        handleMenuClick={handleMenuClick}
      />
      
      <DashboardMenus 
        anchorEl={anchorEl}
        handleMenuClose={handleMenuClose}
      />

      <NotificationsMenu 
        anchorEl={notificationAnchorEl}
        onClose={handleCloseAll}
      />

      <StatCardMenu 
        anchorEl={statCardAnchorEl}
        onClose={handleCloseAll}
      />

      <QuickActions />
      
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 3 } }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            id={1}
            title="Total Sales"
            value={formatINR(2345600)}
            description="vs. last period"
            change={15}
            icon={TrendingUpIcon}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            id={2}
            title="Total Orders"
            value="1,234"
            description="vs. last period"
            change={5}
            icon={ShoppingCartIcon}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            id={3}
            title="Average Order Value"
            value={formatINR(18900)}
            description="vs. last period"
            change={8}
            icon={AccountBalanceWalletIcon}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            id={4}
            title="Total Sellers"
            value="256"
            description="vs. last period"
            change={12}
            icon={StorefrontIcon}
            color={theme.palette.info.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <RecentActivities />
        </Grid>
        <Grid item xs={12} md={4}>
          <SalesByLocation />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TopCustomers />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 