import React from 'react';
import Navigation from './components/Navigation'; // Adjust path as needed
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

axios.defaults.baseURL = 'http://localhost:8000';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  let isAuthenticated = false;

  try {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp > Date.now() / 1000) {
        isAuthenticated = true;
      }
    }
  } catch (error) {
    isAuthenticated = false;
  }

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: '/admin' }} />;
};

const LoginRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  let isAuthenticated = false;

  try {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp > Date.now() / 1000) {
        isAuthenticated = true;
      }
    }
  } catch (error) {
    isAuthenticated = false;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (location.state?.from === '/admin') {
    return children;
  }

  return <Navigate to="/" />;
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
          </Routes>
        </main>
        <Footer />
      </div>
    </CurrencyProvider>
  );
};

export default App;
