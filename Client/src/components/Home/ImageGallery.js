import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Rating, Button, CircularProgress, TextField, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';


const ImageGallery = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the search term from the query string of the URL
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get('search') || '';
  const nights = query.get('nights') || '';
  const days = query.get('days') || '';
  const country = query.get('country') || '';

  const selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';

  const [search, setSearch] = useState(searchTerm);
  const [searchNights, setSearchNights] = useState(nights);
  const [searchDays, setSearchDays] = useState(days);
  const [searchCountry, setSearchCountry] = useState(country);

  useEffect(() => {
    setSearch(searchTerm);
    setSearchNights(nights);
    setSearchDays(days);
    setSearchCountry(country);
  }, [searchTerm, nights, days, country]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tours');
        setTours(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tours. Please try again later.');
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleClick = (id) => {
    navigate(`/tours/${id}`);
  };

  const filteredTours = tours.filter(tour => {
    const searchDaysValue = searchDays ? parseInt(searchDays.split(' ')[0]) : null;
    const searchNightsValue = searchNights ? parseInt(searchNights.split(' ')[0]) : null;

    return (
      (!search || tour.title.toLowerCase().includes(search.toLowerCase())) &&
      (!searchNightsValue || tour.nights === searchNightsValue) &&
      (!searchDaysValue || tour.days === searchDaysValue) &&
      (!searchCountry || tour.country.toLowerCase().includes(searchCountry.toLowerCase()))
    );
  });

  // Function to handle currency conversion
  const convertCurrency = (price) => {
    const rates = {
      USD: 1,
      LKR: 200,
      EUR: 0.85,
      GBP: 0.75,
      JPY: 110,
      AUD: 1.35,
      INR: 75,
    };
    return (price * rates[selectedCurrency]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = new URLSearchParams({
      search,
      nights: searchNights,
      days: searchDays,
      country: searchCountry
    }).toString();
    navigate(`/imagegallery?${query}`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error.message}</Typography>;
  }

  return (
    <Box sx={{ width: '100%', minHeight: '70vh', padding: '20px 30px', backgroundColor: '#f9f9f9' }}>
      {/* Search Bar */}
      <Box mb={3}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
          <TextField
            fullWidth
            label="Search for tours"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            label="Nights"
            variant="outlined"
            value={searchNights}
            onChange={(e) => setSearchNights(e.target.value)}
          />
          <TextField
            label="Days"
            variant="outlined"
            value={searchDays}
            onChange={(e) => setSearchDays(e.target.value)}
          />
          <TextField
            label="Country"
            variant="outlined"
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
          />
          <IconButton type="submit" color="primary">
            <SearchIcon />
          </IconButton>
        </form>
      </Box>

      <Grid container spacing={5}>
        {filteredTours.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{
                borderRadius: '16px',
                height: '630px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
                },
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height={item.tour_image.includes('https://i.ibb.co') ? '300' : '200'} // Conditionally adjust height
                  image={item.tour_image}
                  alt={item.title}
                  sx={{
                    width: '100%',
                    objectFit: 'cover',
                    height: '400px',
                    cursor: 'pointer',
                    '&:hover': {
                      filter: 'brightness(0.85)',
                    },
                  }}
                  onClick={() => handleClick(item._id)}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    padding: '10px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {item.nights + 1} days & {item.nights} nights
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ backgroundColor: '#fff', padding: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="bold" fontSize={20}>
                    {item.title}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Rating name="read-only" value={4.5} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="textSecondary" ml={1}>
                      (23)
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 'bold',
                    }}
                    gutterBottom
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                  >
                    {selectedCurrency} {item.price && !isNaN(item.price) ? convertCurrency(item.price) : 'N/A'}
                    {item.price && !isNaN(item.price) && (
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{ textDecoration: 'line-through', marginLeft: 1, color: 'text.secondary' }}
                      >
                        {selectedCurrency} {convertCurrency(item.price + 500)}
                      </Typography>
                    )}
                    {item.price && !isNaN(item.price) && (
                      <Typography component="span" variant="body2" color="error" fontWeight="bold" backgroundColor="rgba(76, 175, 80, 0.1)" padding={0.5}>
                        SAVE USD 500
                      </Typography>
                    )}
                  </Typography>
                </Box>
                <Box display="flex" gap={2} mt={3}>
                  <Button
                    variant="outlined"
                    startIcon={<PhoneIcon />}
                    sx={{
                      borderColor: '#4CAF50',
                      color: '#4CAF50',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderColor: '#4CAF50',
                      },
                    }}
                  >
                    Call
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#2196F3',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#1976D2',
                      },
                    }}
                  >
                    Request Callback
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImageGallery;
