import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import { PhoneInTalk as PhoneInTalkIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import TourImages from './TourImages';
import Itinerary from './Itinerary';
import Footer from '../components/Footer';
import axios from 'axios';

const convertCurrency = (amount, currency) => {
  const exchangeRates = {
    USD: 1,
    LKR: 200,
    EUR: 0.85,
    GBP: 0.75,
    JPY: 110,
  };
  const rate = exchangeRates[currency] || 1;
  return (amount * rate).toFixed(2);
};

const TourDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tours/${id}`); 
        setTour(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tour details:', error);
        setLoading(false);  
      }
    };
    window.scrollTo(0, 0);
    fetchTourDetails();
  }, [id]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tour) {
    return <div>Tour not found</div>;
  }

  const handleInquiryClick = () => {
    window.location.href = 'tel:+1234567890';  
  };

  return (
    <>
      <Box padding="30px" sx={{ marginLeft: '100px', marginRight: '100px' }}>
        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Dancing Script',
            color: '#023047',
            marginBottom: '20px',
            textAlign: 'left',
          }}
        >
          {tour.title}
        </Typography>

        {/* Days & Nights */}
        <Box className="inline-block bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 py-3 px-8 mb-8 rounded-lg shadow-xl">
          <Typography className="text-white text-6xl font-[Playfair Display]">
            {tour.nights + 1} Days / {tour.nights} Nights
          </Typography>
        </Box>

        {/* Price */}
        <Box className="inline-block bg-gradient-to-r from-red-600 via-red-700 to-red-800 py-3 px-8 mb-12 ml-4 rounded-lg shadow-xl">
          <Typography className="text-white text-7xl font-[Domine]">
            Price: {selectedCurrency} {Number(convertCurrency(tour.price, selectedCurrency)).toLocaleString()}
          </Typography>
        </Box>

        {/* Inquiry Button */}
        <Button
          sx={{
            background: 'linear-gradient(to right, #1e3a8a, #4f46e5)', 
            color: 'white',
            padding: '10px 20px',
            marginLeft: '20px',
            fontSize: '20px',
            fontWeight: 'bold',
            fontFamily: 'Domine',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'auto',
            '&:hover': {
              background: 'linear-gradient(to right, #1e40af, #3730a3)', 
            },
          }}
          onClick={handleInquiryClick}
        >
          <PhoneInTalkIcon sx={{ marginRight: '10px', fontSize: 'inherit' }} />
          Inquiry Now
          <ArrowForwardIcon sx={{ marginLeft: '10px', fontSize: 'inherit' }} />
        </Button>

        {/* others */}
        {/* {tour.others.split("\n").map((line, index) => (
        <Typography
          key={index}
          variant="h5"
          sx={{
            fontFamily: "Dancing Script",
            color: "#023047",
            textAlign: "left",
          }}
        >
          {line}
        </Typography>
      ))}<br></br> */}

        {/* Main Description */}
        {/* <Typography
        sx={{
          fontFamily: 'Playfair Display',
          color: 'black',
          textAlign: 'justify',
          marginBottom: '20px',
          fontSize: '18px',
        }}
      >
        {tour.sum}
      </Typography><br /> */}
        
      {/* Main Image and Gallery */}
      {tour.tour_image && (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
    <div className="main-image-container">
      <img
        src={tour.tour_image}
        alt={tour.title}
        className="main-image"
        style={{
          width: '800px',
          height: 'auto',
          borderRadius: '10px',
          objectFit: 'cover',
          maxHeight: '650px',
        }}
      />
      <div className="main-image-overlay"></div>
    </div>

    {/* Custom Styles */}
    <style>
      {`
        .main-image {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .main-image:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }
        .main-image-container {
          position: relative;
        }
        .main-image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50px;
          border-radius: 0 0 10px 10px;
        }
      `}
    </style>

    {/* Image Gallery */}
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '60%',
        height: 'auto',
      }}
    >
      <TourImages mainImageHeight="500px" />
    </div>
  </div>
)}

        {/* Itinerary Section */}
        <div><br /><br />
          <Itinerary />
        </div>

        {/* Back Button */}
        <Button
          variant="contained"
          sx={{
            display: 'block',
            margin: '20px auto',
            backgroundColor: '#0A369D',
            ':hover': { backgroundColor: '#4472CA' },
          }}
          onClick={() => navigate('/tours')}
        >
          Back to Tours
        </Button>
      </Box>

      <Box sx={{
        width: '100%',
        position: 'relative',
        bottom: 0,
        left: 0,
        backgroundColor: '#023e8a', 
        padding: '20px',
      }}>
        <Footer />
      </Box>
    </>
  );
};

export default TourDetails;