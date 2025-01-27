import React from 'react';
import { AppBar, Typography, Container, Grid, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '15px',
  overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
};

const center = {
  lat: 6.9271,
  lng: 79.8612,
};

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    navigate(path); 
  };

  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: '#023e8a',
        padding: '50px 0',
      }}
    >
      <Container>
        <Grid container spacing={6}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Box>
              <div style={{ marginBottom: '20px', marginLeft : '40px' }}>
                <img
                  src="https://i.postimg.cc/6Q1tcM0S/HL1.png"
                  alt="Holiday Life Logo"
                  style={{ height: '80px', objectFit: 'contain' }}
                />
              </div>
              <Box display="flex" alignItems="center" style={{ color: '#fff', marginBottom: '20px' }}>
                <HomeIcon style={{ marginRight: '15px', fontSize: '28px' }} />
                <Typography variant="body1" style={{ fontSize: '16px' }}>123 Main Street, Colombo, Sri Lanka</Typography>
              </Box>
              <Box display="flex" alignItems="center" style={{ color: '#fff', marginBottom: '20px' }}>
                <PhoneIcon style={{ marginRight: '15px', fontSize: '28px' }} />
                <Typography variant="body1" style={{ fontSize: '16px' }}>Phone: +94 91 565 8956</Typography>
              </Box>
              <Box display="flex" alignItems="center" style={{ color: '#fff', marginBottom: '20px' }}>
                <EmailIcon style={{ marginRight: '15px', fontSize: '28px' }} />
                <Typography variant="body1" style={{ fontSize: '16px' }}>Email: example@example.com</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Navigation Links */}
          <Grid item xs={12} md={4}>
          <Box>
            <Typography
              variant="h5"
              gutterBottom
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              Quick Links
            </Typography>
            <Grid container direction="column" alignItems="center">
              {[
                { name: 'Home', path: '/' },
                { name: 'Tours', path: '/tours' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link, index) => (
                <Button
                  key={index}
                  variant="text"
                  component={Link}
                  to={link.path}
                  style={{
                    color: '#fff',
                    fontSize: '16px',
                    margin: '10px 0',
                    fontWeight: '500',
                    transition: 'color 0.3s ease',
                    marginBottom: '10px',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#90e0ef')}
                  onMouseLeave={(e) => (e.target.style.color = '#fff')}
                  onClick={() => handleNavigation(link.name)}
                >
                  {link.name}
                </Button>
              ))}
            </Grid>
          </Box>
        </Grid>


          {/* Map */}
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                }}
              >
                Find Us Here
              </Typography>
              <LoadScript googleMapsApiKey="AIzaSyBhJYhA-bRJgkniJETT1BY6I1C4fEexfdc">
                <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={14}>
                  <Marker position={center} />
                </GoogleMap>
              </LoadScript>
            </Box>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Box textAlign="center" marginTop="40px">
          <Typography
            variant="body2"
            style={{ color: '#fff', fontSize: '14px' }}
          >
            &copy; {new Date().getFullYear()} The Holiday Life. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Footer;
