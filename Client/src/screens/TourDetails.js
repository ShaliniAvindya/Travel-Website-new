import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, IconButton, CircularProgress } from '@mui/material';
import TourImages from './TourImages';
import Itinerary from './Itinerary';
import Footer from '../components/Footer';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InquiryForm from '../components/Home/InquiryForm';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { tourGallery } from '../components/Home/imageGalleryData';
import { 
  Star, MapPin, Users, Clock, Shield, Calendar, Award, Anchor, ArrowLeft, Check,
  ChevronRight, Phone
} from 'lucide-react';
import throttle from 'lodash.throttle';

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
  const [scrollY, setScrollY] = useState(0);
  const [selectedNightsKey, setSelectedNightsKey] = useState(null);
  const [imageError, setImageError] = useState(false);

  const { isMobile, isTablet } = useDeviceType();
  const selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';

  const convertPrice = (priceInUSD) => {
    if (!exchangeRates[selectedCurrency]) return priceInUSD.toLocaleString();
    return (priceInUSD * exchangeRates[selectedCurrency]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/9609969974`;
    window.open(whatsappUrl, '_blank');
  };

  const handleImageError = () => {
    console.error('Primary image failed to load:', tour?.tour_image);
    setImageError(true);
  };

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrollY(window.scrollY);
    }, 100);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, []);

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(`/tours/${id}`);
        console.log('Tour data:', response.data); // Debug tour.tour_image
        setTour(response.data);
      } catch (error) {
        console.error('Error fetching tour details:', error);
        const foundTour = tourGallery.find(t => t._id.$oid === id);
        console.log('Fallback tour:', foundTour); // Debug fallback
        setTour(foundTour || null);
      } finally {
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

  useEffect(() => {
    if (tour && tour.nights && typeof tour.nights === 'object') {
      const nightsKeys = Object.keys(tour.nights);
      if (nightsKeys.length > 0) {
        setSelectedNightsKey(nightsKeys[0]);
      }
    }
  }, [tour]);

  const basePrice = tour ? tour.price : 0;
  const oldBasePrice = tour ? tour.oldPrice || tour.price * 1.2 : 0;
  const totalPrice = basePrice;
  const finalOldPrice = oldBasePrice;

  const nightsCount = selectedNightsKey ? parseInt(selectedNightsKey) : 0;
  const daysCount = nightsCount + 1;
  const personCount = tour ? tour.person_count || 2 : 0;

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-4">
          <div className="relative mb-8">
            <CircularProgress size={80} className="text-blue-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Anchor className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <Typography variant="h5" className="text-blue-900 font-bold mb-2">Exploring Paradise</Typography>
          <Typography variant="body1" className="text-gray-600">Loading your dream experience...</Typography>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-4">
          <div className="text-red-500 text-8xl mb-6">⚠️</div>
          <Typography variant="h4" className="text-red-600 font-bold mb-4">
            Oops! Tour Not Found
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-8">
            The paradise you're looking for seems to have sailed away. Let's find you another slice of heaven!
          </Typography>
          <Button
            variant="contained"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            onClick={() => navigate('/tours')}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Explore All Tours
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
     {/* Hero Section with Parallax */}
      <div className="relative h-[75vh] min-h-[95vh] overflow-hidden mt-0 bg-gray-900 z-0">
        <div className="absolute inset-0 bg-gray-900 z-0"></div>
        
          <img
            src={tour?.tour_image || 'https://i.postimg.cc/50CFBvJT/abdulla-faiz-0-DGZu-Jxta3k-unsplash.jpg'}
            alt={`${tour?.title || 'Tour'} Background`}
            className="absolute inset-0 w-full h-full object-cover object-center z-10"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70 z-20"></div>
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-center text-white max-w-4xl mx-4">
              <div className="mb-6">
                <div className="inline-flex items-center bg-cyan-600/90 backdrop-blur-sm rounded-full px-6 py-3 text-lg font-medium mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  Maldives Paradise
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fadeInUp">
                {tour.title || 'Your Dream Tour'}
              </h1>
              <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto">
                Discover the ultimate tropical escape where luxury meets nature in perfect harmony
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                  onClick={handleOpenDialog}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center"
                >
                  <Calendar className="mr-2 w-5 h-5" />
                  Book This Experience
                </button>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {selectedCurrency} {convertPrice(totalPrice || 0)}
                  </div>
                  <div className="text-cyan-200">for {personCount || 2} person(s)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-30">
            <div className="flex flex-col items-center">
              <span className="text-sm mb-2">Scroll to explore</span>
              <ChevronRight className="w-6 h-6 transform rotate-90" />
            </div>
          </div>
        </div>

      {/* Quick Stats Bar */}
      <div className="bg-white shadow-xl border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-blue-900">{daysCount}</span>
              </div>
              <span className="text-gray-600 font-medium">Days / {nightsCount} Nights</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-emerald-600 mr-2" />
                <span className="text-2xl font-bold text-emerald-900">{personCount}</span>
              </div>
              <span className="text-gray-600 font-medium">Travelers</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold text-yellow-600">4.9</span>
              </div>
              <span className="text-gray-600 font-medium">Rating</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-purple-600 mr-2" />
                <span className="text-2xl font-bold text-purple-900">Premium</span>
              </div>
              <span className="text-gray-600 font-medium">Experience</span>
            </div>
          </div>
        </div>
      </div>

     
      {/* Main Content with Booking Card */}
      <div className="max-w-10xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Itinerary Section  */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-white/50 p-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Your Journey Day by Day</h2>
              <Itinerary 
                tourData={tour} 
                selectedNightsKey={selectedNightsKey}
                deviceType={isTablet ? 'tablet' : 'desktop'}
              />
            </div>
          </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="bg-white rounded-3xl shadow-xl border border-white/50 p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-blue-900 mb-2">Reserve Your Paradise</h3>
                    <p className="text-gray-600">Limited availability - Book now!</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-6 rounded-2xl mb-6">
                    <div className="text-center">
                      <div className="text-sm font-medium opacity-90 mb-2">Total Price</div>
                      <div className="text-4xl font-bold mb-1">
                        {selectedCurrency} {convertPrice(totalPrice)}
                      </div>
                      {finalOldPrice > totalPrice && (
                        <div className="text-lg opacity-75 line-through">
                          {selectedCurrency} {convertPrice(finalOldPrice)}
                        </div>
                      )}
                      <div className="text-sm opacity-90 mt-2">
                        For {personCount} person(s) • {daysCount} days
                      </div>
                    </div>
                  </div>

                  {/* Quick Info Cards Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                      <div className="flex items-center mb-2">
                        <AccessTimeIcon className="w-5 h-5 text-emerald-600 mr-2" />
                        <span className="text-sm font-medium text-emerald-800">Duration</span>
                      </div>
                      <div className="text-lg font-bold text-emerald-900">
                        {nightsCount} Nights
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center mb-2">
                        <CalendarMonthIcon className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-purple-800">Available</span>
                      </div>
                      <div className="text-sm font-bold text-purple-900">
                        Year Round
                      </div>
                    </div>
                  </div>

                  {/* Validity Period */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200 mb-6">
                    <div className="text-center">
                      <DateRangeIcon className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                      <div className="text-sm font-medium text-orange-800 mb-2">Package Valid</div>
                      <div className="space-y-1">
                        <div className="font-bold text-orange-900">
                          {new Date(tour.valid_from || '2025-01-01').toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-sm text-orange-700">to</div>
                        <div className="font-bold text-orange-900">
                          {new Date(tour.valid_to || '2025-04-14').toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={handleOpenDialog}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center"
                    >
                      <SendIcon className="mr-2" />
                      Book This Experience
                    </button>
                    
                    <button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-medium transition-all flex items-center justify-center"
                    >
                      <WhatsAppIcon className="mr-2" />
                      Chat on WhatsApp
                    </button>

                    <button
                      onClick={() => {
                        const phone = '+9609969974';
                        window.open(`tel:${phone}`, '_self');
                      }}
                      className="w-full bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-800 px-6 py-3 rounded-2xl font-medium transition-all flex items-center justify-center"
                    >
                      <Phone className="mr-2 w-5 h-5" />
                      Call Us
                    </button>
                  </div>

                  {/* Guarantee Note */}
                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center text-blue-600 mb-2">
                      <Shield className="w-5 h-5 mr-2" />
                      <span className="font-medium">Best Price Guarantee</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Find a better price? We'll match it!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Inquiry Form Modal */}
      <InquiryForm 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        tourName={tour.title}
        selectedNights={nightsCount}
        selectedFood={''}
        totalPrice={totalPrice}
      />

    </div>
  );
};

export default TourDetails;