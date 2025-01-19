import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import { PhoneInTalk as PhoneInTalkIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { tourGallery } from '../components/Home/imageGalleryData'; 
import TourImages from './TourImages';
import Itinerary from './Itinerary';
import Footer from '../components/Footer';

const TourDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const tourDetails = tourGallery.find((tour) => tour._id.$oid === id);

  if (!tourDetails) {
    return (
      <Box padding="30px" textAlign="center">
        <Typography
          variant="h4"
          sx={{ color: '#D32F2F', fontFamily: 'Domine' }}
        >
          Tour not found
        </Typography>
        <Button
          variant="contained"
          sx={{
            marginTop: '20px',
            backgroundColor: '#0A369D',
            ':hover': { backgroundColor: '#4472CA' },
          }}
          onClick={() => navigate('/')}
        >
          Back to Tours
        </Button>
      </Box>
    );
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
          {tourDetails.title}
        </Typography>

        {/* Days & Nights */}
        <Box className="inline-block bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 py-3 px-8 mb-8 rounded-lg shadow-xl">
          <Typography className="text-white text-6xl font-[Playfair Display]">
            {tourDetails.days} Days / {tourDetails.days - 1} Nights
          </Typography>
        </Box>

        {/* Price */}
        <Box className="inline-block bg-gradient-to-r from-red-600 via-red-700 to-red-800 py-3 px-8 mb-12 ml-4 rounded-lg shadow-xl">
          <Typography className="text-white text-7xl font-[Domine]">
            Price: USD {tourDetails.price.toLocaleString()}
          </Typography>
        </Box>

        {/* Inquiry Button */}
        <Button
          sx={{
            background: 'linear-gradient(to right, #1e3a8a, #4f46e5)', // Gradient background
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
        {tourDetails.others.split("\n").map((line, index) => (
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
      ))}<br></br>


        {/* Main Description */}
        <Typography
        sx={{
          fontFamily: 'Playfair Display',
          color: 'black',
          textAlign: 'justify',
          marginBottom: '20px',
          fontSize: '18px',
        }}
      >
        {tourDetails.sum}
      </Typography><br />
        

        {/* Main Image and Gallery */}
        {tourDetails.images && tourDetails.images[0] && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div className="main-image-container">
              <img
                src={tourDetails.images[0]}
                alt={tourDetails.title}
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
              `}
            </style>

            {/* Image Gallery on the Right */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '60%',
                height: 'auto',
              }}
            >
              <TourImages mainImageHeight="400px" />
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
          onClick={() => navigate('/')}
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
