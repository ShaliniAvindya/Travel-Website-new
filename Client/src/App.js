import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import Tours from './screens/Tours';
import Register from './screens/Register';
import Login from './screens/Login';
import Contact from './screens/Contact';
import AdminPanel from './screens/AdminPanel';
import TourDetails from './screens/TourDetails';
import Itinerary from './screens/Itinerary';
import { CurrencyProvider } from './screens/CurrencyContext';
import Footer from './components/Footer';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

axios.defaults.baseURL = 'https://travel-website-new-dp4q-backend.vercel.app';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/users/check-auth', { withCredentials: true });
        if (response.data.isAuthenticated && response.data.isAdmin) {
          setIsAuthenticated(true);
          setIsAdmin(true);
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp > Date.now() / 1000) {
          checkAuth();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    } else {
      checkAuth();
    }
  }, [token]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

const LoginRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/users/check-auth', { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp > Date.now() / 1000) {
          checkAuth();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    } else {
      checkAuth();
    }
  }, [token]);

  if (isLoading) {
    return null;
  }

  if (location.pathname === '/login' && !location.state?.from) {
    return <Navigate to="/" replace />;
  }

  // Allow login page only /admin
  if (location.state?.from === '/admin') {
    return children;
  }

  return <Navigate to="/" replace />;
};

const App = () => {
  return (
    <CurrencyProvider>
      <div className="flex flex-col min-h-screen relative">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginRoute><Login /></LoginRoute>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/tours/:id" element={<TourDetails />} />
            <Route path="/itinerary/:id" element={<Itinerary />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CurrencyProvider>
  );
};

export default App;

