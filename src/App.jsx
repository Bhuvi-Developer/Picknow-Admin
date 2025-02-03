import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import VendorDashboard from './pages/VendorDashboard';
import Layout from './components/Layout';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Vendors from './pages/Vendors';
import Offers from './pages/Offers';
import Deals from './pages/Deals';
import AdminUsers from './pages/AdminUsers';
import ComboOffers from './pages/ComboOffers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children, allowedUserType }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserType && userType !== allowedUserType) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');

  if (isLoggedIn) {
    if (userType === 'admin') {
      return <Navigate to="/dashboard" replace />;
    } else if (userType === 'vendor') {
      return <Navigate to="/vendor-dashboard" replace />;
    }
  }

  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute allowedUserType="admin">
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="offers" element={<Offers />} />
              <Route path="combo-offers" element={<ComboOffers />} />
              <Route path="deals" element={<Deals />} />
              <Route path="admin-users" element={<AdminUsers />} />
            </Route>

            {/* Vendor Routes */}
            <Route
              path="/vendor-dashboard"
              element={
                <PrivateRoute allowedUserType="vendor">
                  <VendorDashboard />
                </PrivateRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
