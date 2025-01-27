import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Rating, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';
import Swal from 'sweetalert2';
import { Dialog, DialogContent, DialogActions, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ImageGallery = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumber1, setPhoneNumber1] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellerCount, setTravellerCount] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tours'); // Replace with your API endpoint
        setTours(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tours. Please try again later.');
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleInquireNowClick = (tour) => {
    setSelectedTour(tour);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setName('');
    setEmail('');
    setPhoneNumber('');
    setTravelDate('');
    setTravellerCount('');
    setMessage('');
  };

  const handleSubmitInquiry = async () => {
    try {
      const payload = {
        name,
        email,
        phone_number: `${phoneNumber} ${phoneNumber1}`,
        travel_date: travelDate,
        traveller_count: travellerCount,
        message,
        tour_id: selectedTour._id,
      };

      await axios.post('http://localhost:8000/api/inquiries', payload);
      Swal.fire('Success!', 'Your inquiry has been submitted successfully.', 'success');
      handleCloseDialog();
    } catch (error) {
      Swal.fire('Error!', 'Failed to submit inquiry. Please try again.', 'error');
    }
  };

  const handleClick = (id) => {
    navigate(`/tours/${id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/9607699699`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Box sx={{ width: '100%', minHeight: '65vh', padding: '20px 30px', backgroundColor: '#f9f9f9' }}>
      <Grid container spacing={5}>
        {tours.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{
                borderRadius: '16px',
                height: '580px',
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
                {/* Check if images array is empty and use a default placeholder image */}
                <CardMedia
                  component="img"
                  height="200"
                  image={item.tour_image}
                  alt={item.title}
                  sx={{
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
                  <Typography variant="h1" fontWeight="bold" fontSize={24}>
                    {item.title}
                  </Typography>
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
                    {/* Check if price exists and is a valid number before calling toLocaleString */}
                    USD {item.price && !isNaN(item.price) ? item.price.toLocaleString() : 'N/A'} {' '}
                    {item.price && !isNaN(item.price) && (
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{ textDecoration: 'line-through', marginLeft: 1, color: 'text.secondary' }}
                      >
                        USD {(item.price + 500).toLocaleString()}
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
                    startIcon={<WhatsAppIcon />}
                    sx={{
                      borderColor: '#4CAF50',
                      color: '#4CAF50',
                      padding: '0px 15px',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderColor: '#4CAF50',
                      },
                    }}
                    onClick={() => handleWhatsAppClick()}
                  >
                    Chat
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#2196F3',
                      color: '#fff',
                      padding: '5px 0',
                      '&:hover': {
                        backgroundColor: '#1976D2',
                      },
                    }}
                    onClick={() => handleInquireNowClick(item)}
                  >
                     Inquire Now
                     <SendIcon sx={{ marginLeft: '10px', fontSize: 'inherit' }} />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            width: '35vw',
            borderRadius: '16px',
            overflowX: 'hidden',
          },
        }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '16px',
            }}
          >
            {/* Left: Image, Title, and Prices */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {selectedTour?.tour_image && (
                <img
                  src={selectedTour.tour_image}
                  alt={selectedTour.title}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginRight: '16px',
                  }}
                />
              )}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedTour?.title || 'Tour Title'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: '4px' }}>
                  <Typography
                    sx={{
                      color: '#333',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                    }}
                  >
                    {selectedTour?.price
                      ? `LKR ${Number(selectedTour.price).toLocaleString()}`
                      : 'Price not available'}
                  </Typography>
                  {selectedTour?.oldPrice && (
                    <Typography
                      sx={{
                        ml: '8px',
                        color: '#888',
                        textDecoration: 'line-through',
                        fontSize: '0.9rem',
                      }}
                    >
                      LKR {Number(selectedTour.oldPrice).toLocaleString()}
                    </Typography>
                  )}
                  {selectedTour?.price && selectedTour?.oldPrice && (
                    <Typography
                      sx={{
                        ml: '8px',
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }}
                    >
                      SAVE LKR {Number(selectedTour.oldPrice - selectedTour.price).toLocaleString()}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
              <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
              </IconButton>
          </Box>
          <DialogContent sx={{ pt: 0 , pb: '0px', px: '16px' }}>
          <TextField
            required
            label="Full Name"
            fullWidth
            margin="normal"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            required
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Box sx={{ display: 'flex', gap: '8px', mt: 2 }}>
            <TextField
              label="country code"
              sx={{ width: '100px' }}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
              required
              label="Your Phone"
              fullWidth
              type="tel"
              onChange={(e) => setPhoneNumber1(e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: '8px', mt: 2 }}>
            <TextField
              required
              label="Travel Date"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setTravelDate(e.target.value)}
            />
            <TextField
              required
              label="Traveller Count"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              onChange={(e) => setTravellerCount(e.target.value)}
            />
          </Box>
          <TextField
            label="Message..."
            multiline
            rows={3}
            fullWidth
            margin="normal"
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>

        {/* Bottom Section */}
        <DialogActions sx={{ justifyContent: 'center', pb: '16px' }}>
          <Button
            variant="contained"
            onClick={() => {
              // Handle form submission logic here
              handleSubmitInquiry();
            }}
            sx={{
              backgroundColor: '#016170',
              color: '#fff',
              padding: '8px 16px',
              fontSize: '16px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#e65c00',
              },
            }}
          >
            Connect with an Expert
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageGallery;
