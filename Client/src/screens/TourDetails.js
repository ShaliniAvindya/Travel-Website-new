import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import TourImages from './TourImages';
import Itinerary from './Itinerary';
import Footer from '../components/Footer';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InquiryForm from '../components/Home/InquiryForm';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DateRangeIcon from '@mui/icons-material/DateRange';

function useDeviceType() {
  const [deviceType, setDeviceType] = useState({
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceType({
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

const TourDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState({});

  const { isMobile, isTablet } = useDeviceType();
  const selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';

  // Update the food category map for the new object structure (keys: 0,1,2)
  const foodCategoryMap = {
    0: 'Half Board',
    1: 'Full Board',
    2: 'All Inclusive'
  };

  // New state for selections
  const [selectedNightsKey, setSelectedNightsKey] = useState(null);
  const [selectedNightsOption, setSelectedNightsOption] = useState(null);
  const [selectedFoodCategory, setSelectedFoodCategory] = useState(null);

  // Price conversion
  const convertPrice = (priceInUSD) => {
    if (!exchangeRates[selectedCurrency]) return priceInUSD.toLocaleString();
    return (priceInUSD * exchangeRates[selectedCurrency]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/9609969974`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(`/tours/${id}`); 
        setTour(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tour details:', error);
        setLoading(false);  
      }
    };

    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };
  
    fetchExchangeRates();
    window.scrollTo(0, 0);
    fetchTourDetails();
  }, [id]); 

  // Initialize selection defaults when tour data loads
  useEffect(() => {
    if (tour) {
      // Initialize nights selection if the tour.nights is an object (new structure)
      if (tour.nights && typeof tour.nights === 'object') {
        const nightsKeys = Object.keys(tour.nights);
        if (nightsKeys.length > 0) {
          setSelectedNightsKey(nightsKeys[0]);
          const firstOptions = tour.nights[nightsKeys[0]];
          const optionKeys = Object.keys(firstOptions);
          if (optionKeys.length > 0) {
            setSelectedNightsOption(optionKeys[0]);
          }
        }
      }
      // Initialize food category selection
      if (tour.food_category && typeof tour.food_category === 'object') {
        const foodKeys = Object.keys(tour.food_category);
        if (foodKeys.length > 0) {
          setSelectedFoodCategory(foodKeys[0]);
        }
      }
    }
  }, [tour]);

  // Compute total price based on selections
  const basePrice = tour ? tour.price : 0;
  const oldBasePrice = tour ? tour.oldPrice : 0;
  const nightsAddPrice = (selectedNightsKey && selectedNightsOption && tour && tour.nights[selectedNightsKey])
    ? tour.nights[selectedNightsKey][selectedNightsOption].add_price
    : 0;
  const foodAddPrice = (selectedFoodCategory && tour && tour.food_category)
    ? tour.food_category[selectedFoodCategory][0]
    : 0;
  const totalPrice = basePrice + nightsAddPrice + foodAddPrice;

  const nightsOldPrice = (selectedNightsKey && selectedNightsOption && tour && tour.nights[selectedNightsKey])
    ? tour.nights[selectedNightsKey][selectedNightsOption].old_add_price
    : 0;
  const foodOldPrice = (selectedFoodCategory && tour && tour.food_category)
    ? tour.food_category[selectedFoodCategory][1]
    : 0;

  const finalOldPrice = oldBasePrice + nightsOldPrice + foodOldPrice;

  // Compute days and nights based on selection (if available)
  const nightsCount = selectedNightsKey ? parseInt(selectedNightsKey) : 0;
  const daysCount = nightsCount + 1;

  const [openDialog, setOpenDialog] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tour) {
    return <div>Tour not found</div>;
  }

  // Handlers to open/close inquiry dialog
  const handleOpenDialog = () => setOpenDialog(true);

  return (
    <>
      <Box padding={isMobile ? '3vw' : '2vw'} sx={{ margin: '0 6vw', backgroundColor: '#f0f0f0' }}>
        {/* Tour Title */}
        <Typography
          variant={isMobile ? 'h4' : isTablet ? 'h3' : "h2"}
          sx={{
            fontFamily: 'Dancing Script',
            color: '#023047',
            marginBottom: '40px',
            marginTop: '20px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {tour.title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'flex-start',
            gap: 0,
            mb: 2,
            padding: '0 40px',
          }}
        >
          {/* --- Selections for Nights and Food Category --- */}
          <Box sx={{ marginBottom: '30px', display: 'flex',flexDirection: 'column', gap: 2}}>
            {/* Nights selection */}
            {tour.nights && (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ mr: 2 }}>Select Nights:</Typography>
                {Object.keys(tour.nights).map((key) => (
                  <Box
                    key={key}
                    onClick={() => {
                      setSelectedNightsKey(key);
                      setSelectedNightsOption(Object.keys(tour.nights[key])[0]);
                    }}
                    sx={{
                      border: selectedNightsKey === key ? '2px solid blue' : '1px solid grey',
                      borderRadius: 1,
                      p: 1,
                      mr: 1,
                      cursor: 'pointer'
                    }}
                  >
                    <Typography>{key} Nights</Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Option selection for chosen nights */}
            {selectedNightsKey && tour.nights[selectedNightsKey] && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Select Option for {selectedNightsKey} Nights:
                </Typography>
                {Object.keys(tour.nights[selectedNightsKey]).map((optKey) => (
                  <Box
                    key={optKey}
                    onClick={() => setSelectedNightsOption(optKey)}
                    sx={{
                      border: selectedNightsOption === optKey ? '2px solid blue' : '1px solid grey',
                      borderRadius: 1,
                      p: 1,
                      mb: 1,
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    <Typography>
                      {tour.nights[selectedNightsKey][optKey].option} 
                      <Typography
                        component="span"
                        sx={{ color: 'gray', ml: 1 }}
                      >
                        (+{selectedCurrency}{" "}
                        {convertPrice(tour.nights[selectedNightsKey][optKey].add_price)}
                        )
                      </Typography>
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Food Category selection */}
            {tour.food_category && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Select Food Category:</Typography>
                {Object.keys(tour.food_category).map((key) => (
                  <Box
                    key={key}
                    onClick={() => setSelectedFoodCategory(key)}
                    sx={{
                      border: selectedFoodCategory === key ? '2px solid blue' : '1px solid grey',
                      borderRadius: 1,
                      p: 1,
                      mb: 1,
                      cursor: 'pointer',
                      width: 'fit-content',
                      minWidth: { xs: '100%', sm: 'auto'}
                    }}
                  >
                    <Typography>
                      {foodCategoryMap[key]} 
                      <Typography
                        component="span"
                        sx={{ color: 'gray', ml: 1 }}
                      >
                        (+{selectedCurrency}{" "}
                        {convertPrice(tour.food_category[key][0])}
                        )
                      </Typography>
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          {/* RIGHT: Enhanced info cards */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: '400px',
              }}
            >
              {/* Days/Nights Card */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #1a365d 0%, #2563eb 100%)',
                  borderRadius: '16px',
                  padding: '15px',
                  color: 'white',
                  boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)',
                  transform: 'translateY(0)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 30px rgba(37, 99, 235, 0.3)',
                  },
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  <AccessTimeIcon sx={{ fontSize: 32, mr: 1 }} />
                  {daysCount} Days / {nightsCount} Nights
                </Typography>
              </Box>

              {/* Price Card */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
                  borderRadius: '16px',
                  padding: '15px',
                  color: 'white',
                  boxShadow: '0 10px 20px rgba(5, 150, 105, 0.2)',
                  transform: 'translateY(0)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 30px rgba(5, 150, 105, 0.3)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
                  <AttachMoneyIcon sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Price
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {selectedCurrency} {convertPrice(totalPrice)}
                </Typography>
                {finalOldPrice > totalPrice && (
                  <Typography 
                    sx={{ 
                      textDecoration: 'line-through',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {selectedCurrency} {convertPrice(finalOldPrice)}
                  </Typography>
                )}
              </Box>

              {/* Expiry Card */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
                  borderRadius: '16px',
                  padding: '15px',
                  color: 'white',
                  boxShadow: '0 10px 20px rgba(220, 38, 38, 0.2)',
                  transform: 'translateY(0)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 30px rgba(220, 38, 38, 0.3)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarMonthIcon sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    Expires On
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {new Date(tour.expiry_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>

              {/* Validity Card */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                  borderRadius: '16px',
                  padding: '15px',
                  color: 'white',
                  boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)',
                  transform: 'translateY(0)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 30px rgba(59, 130, 246, 0.3)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DateRangeIcon sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    Valid Period
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {new Date(tour.valid_from).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                  -
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {new Date(tour.valid_to).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                  </Box>
              </Box>
            </Box>
          )}
        </Box>

        {isMobile && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 1,
              mb: 5
            }}
          >
            {/* Days/Nights Card */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #1a365d 0%, #2563eb 100%)',
                borderRadius: '16px',
                padding: '15px',
                color: 'white',
                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)',
                transform: 'translateY(0)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 30px rgba(37, 99, 235, 0.3)',
                },
                textAlign: 'center',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                <AccessTimeIcon sx={{ fontSize: 25, mr: 1 }} />
                {daysCount} Days / {nightsCount} Nights
              </Typography>
            </Box>

            {/* Price Card */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
                borderRadius: '16px',
                padding: '15px',
                color: 'white',
                boxShadow: '0 10px 20px rgba(5, 150, 105, 0.2)',
                transform: 'translateY(0)',
                transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 30px rgba(5, 150, 105, 0.3)',
                },
                textAlign: 'center',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                <AttachMoneyIcon sx={{ fontSize: 25, mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  Price
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {selectedCurrency} {convertPrice(totalPrice)}
              </Typography>
              {finalOldPrice > totalPrice && (
                <Typography 
                  sx={{ 
                    textDecoration: 'line-through',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  {selectedCurrency} {convertPrice(finalOldPrice)}
                </Typography>
              )}
            </Box>

            {/* Expires On Card */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
                borderRadius: '16px',
                padding: '15px',
                color: 'white',
                boxShadow: '0 10px 20px rgba(220, 38, 38, 0.2)',
                transform: 'translateY(0)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 30px rgba(220, 38, 38, 0.3)',
                },
                textAlign: 'center',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                <CalendarMonthIcon sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Expires On
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {new Date(tour.expiry_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>

            {/* Valid Period Card */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                borderRadius: '16px',
                padding: '15px',
                color: 'white',
                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)',
                transform: 'translateY(0)',
                transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 30px rgba(59, 130, 246, 0.3)',
                },
                textAlign: 'center',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                <DateRangeIcon sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Valid Period
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {new Date(tour.valid_from).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  to
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {new Date(tour.valid_to).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            </Box>

            {/* Inquire Now Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                sx={{
                  background: 'linear-gradient(to right, #1e3a8a, #4f46e5)',
                  color: 'white',
                  padding: '10px 20px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  fontFamily: 'Domine',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '10px',
                  width: '100%',
                  '&:hover': {
                    background: 'linear-gradient(to right, #1e40af, #3730a3)',
                  },
                }}
                onClick={handleOpenDialog}
              >
                Inquire Now
                <SendIcon sx={{ marginLeft: '10px', fontSize: 'inherit' }} />
              </Button>
            </Box>
          </Box>
        )}


        {/* Tour Images */}
        {tour.tour_image && (
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'flex-start', gap: '20px' }}>
            <div className="main-image-container" style={{ position: 'relative' }}>
              <img
                src={tour.tour_image}
                alt={tour.title}
                className="main-image"
                style={{
                  width: isMobile ? '100%' : '65vw',
                  height: 'auto',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  maxHeight: '650px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              />
              <div
                className="main-image-overlay"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '50px',
                  borderRadius: '0 0 10px 10px',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '60%',
                height: 'auto',
              }}
            >
              <TourImages
                destinations={tour.destination_images}
                activities={tour.activity_images}
                hotels={tour.hotel_images}
                deviceType={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
              />
            </div>
          </div>
        )}

        {/* Itinerary Section */}
        <div><br /><br />
          <Itinerary selectedNightsKey={selectedNightsKey}/>
        </div>

        {/* Back & Inquire Buttons */}
        <div className='flex flex-col lg:flex-row justify-center gap-2 mt-6 pb-6'>
          <Button
            variant="contained"
            sx={{
              display: 'block',
              backgroundColor: 'rgba(68, 114, 202, 0.3)',
              color: '#041e6b',
              ':hover': { backgroundColor: '#4472CA' },
            }}
            onClick={() => navigate('/tours')}
          >
            Back to Tours
          </Button>
          <Button
            sx={{
              background: "linear-gradient(to right, #1e3a8a, #4f46e5)",
              color: "white",
              padding: "7px 20px",
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: "Domine",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "auto",
              "&:hover": {
                background: "linear-gradient(to right, #1e40af, #3730a3)",
              },
            }}
            onClick={handleOpenDialog}
          >
            Inquire Now
            <SendIcon sx={{ marginLeft: '10px', fontSize: 'inherit' }} />
          </Button>
        </div>
        <div>
        <InquiryForm
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          selectedTour={tour}
          selectedCurrency={selectedCurrency}
          convertPrice={convertPrice}
          isMobile={isMobile}
          // Add these new props:
          finalPrice={totalPrice} 
          finalOldPrice={finalOldPrice}
          selectedNightsKey={selectedNightsKey}   // e.g. "4"
          selectedNightsOption={selectedNightsOption} // e.g. "0"
          selectedFoodCategory={selectedFoodCategory} // e.g. "1"
        />
        </div>
      </Box>
      <Footer />
      <IconButton
        onClick={handleWhatsAppClick}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: '#25D366',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#128C7E',
          },
          zIndex: 1000,
        }}
      >
        <WhatsAppIcon />
      </IconButton>
    </>
  );
};

export default TourDetails;
