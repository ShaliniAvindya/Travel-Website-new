import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, IconButton, CircularProgress } from '@mui/material';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InquiryForm from '../components/Home/InquiryForm';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { 
  Star, MapPin, Users, Clock, Shield, Calendar, Award, Anchor, ArrowLeft, Check,
  ChevronRight, Phone, DollarSign, Eye, X, ChevronLeft
} from 'lucide-react';
import throttle from 'lodash.throttle';
import Itinerary from './Itinerary';

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

const ImageGalleryPopup = ({ images, title, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center animate-fadeIn">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2 transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="absolute top-4 left-4 text-white z-10 bg-black bg-opacity-50 rounded-lg px-4 py-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm opacity-80">{currentImageIndex + 1} of {images.length}</p>
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-3 transition-colors duration-200"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-3 transition-colors duration-200"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}
        <div className="max-w-5xl max-h-full flex items-center justify-center">
          <img
            src={images[currentImageIndex]}
            alt={`${title} ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transform scale-100 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2 max-w-md overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TourImages = ({ destinations, activities, hotels, deviceType }) => {
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const [popupState, setPopupState] = useState({ isOpen: false, images: [], title: '' });

  const galleryDetails = [
    {
      title: 'Destinations',
      description: 'Discover breathtaking landscapes, pristine beaches, and captivating cultural landmarks around the globe.',
      images: destinations || [],
    },
    {
      title: 'Activities',
      description: 'Engage in thrilling adventures and immersive experiences—from underwater diving to mountain treks.',
      images: activities || [],
    },
    {
      title: 'Hotels',
      description: 'Stay in luxurious accommodations offering stunning views, world-class amenities, and exceptional hospitality.',
      images: hotels || [],
    },
  ].filter(section => section.images.length > 0);

  const openPopup = (section) => {
    setPopupState({ isOpen: true, images: section.images, title: section.title });
  };

  const closePopup = () => {
    setPopupState({ isOpen: false, images: [], title: '' });
  };

  return (
    <>
      <div className={`grid ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
        {galleryDetails.map((section, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => openPopup(section)}
          >
            <div className="relative rounded-xl overflow-hidden shadow-lg h-48">
              {section.images.length > 0 && (
                <img
                  src={section.images[0]}
                  alt={`Cover for ${section.title}`}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-bold text-lg">{section.title}</p>
                <p className="text-sm opacity-90">{section.images.length} Photos</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ImageGalleryPopup
        images={popupState.images}
        title={popupState.title}
        isOpen={popupState.isOpen}
        onClose={closePopup}
      />
    </>
  );
};

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const [selectedNightsKey, setSelectedNightsKey] = useState(null);
  const [selectedNightsOption, setSelectedNightsOption] = useState(null);
  const [selectedFoodCategory, setSelectedFoodCategory] = useState(null);
  const [imageError, setImageError] = useState(false);
  const { isMobile, isTablet } = useDeviceType();
  const [openDialog, setOpenDialog] = useState(false);
  const selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';

  const foodCategoryMap = {
    0: 'Half Board',
    1: 'Full Board',
    2: 'All Inclusive'
  };

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
        const response = await axios.get(`https://travel-website-new-dp4q-backend.vercel.app/api/tours/${id}`);
        setTour(response.data);
      } catch (error) {
        console.error('Error fetching tour details:', error);
        setTour(null);
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
        const defaultNightsKey = nightsKeys[0]; 
        setSelectedNightsKey(defaultNightsKey);
        const firstOptions = tour.nights[defaultNightsKey];
        const optionKeys = Object.keys(firstOptions);
        if (optionKeys.length > 0) {
          setSelectedNightsOption(optionKeys[0]); 
        } else {
          setSelectedNightsOption('standard');
        }
      } else {
        setSelectedNightsKey(String(tour.days - 1));
        setSelectedNightsOption('standard');
      }
    } else if (tour && tour.days) {
      setSelectedNightsKey(String(tour.days - 1)); 
      setSelectedNightsOption('standard');
    }

    if (tour && tour.food_category && typeof tour.food_category === 'object') {
      const availableFoodKeys = Object.keys(tour.food_category).filter(
        key => tour.food_category[key][2] === true
      );
      if (availableFoodKeys.length > 0) {
        setSelectedFoodCategory(availableFoodKeys[0]); 
      } else {
        setSelectedFoodCategory('0'); 
      }
    }
  }, [tour]);

  const basePrice = tour && typeof tour.price === 'number' ? tour.price : 0;
  const oldBasePrice = tour && typeof tour.oldPrice === 'number' ? tour.oldPrice : (tour && typeof tour.price === 'number' ? tour.price * 1.2 : 0);
  const nightsCount = selectedNightsKey ? parseInt(selectedNightsKey, 10) : (tour && typeof tour.days === 'number' ? tour.days - 1 : 0);
  const daysCount = nightsCount + 1;
  const personCount = tour && typeof tour.person_count === 'number' ? tour.person_count : 0;
  const nightsAddPrice = (tour && selectedNightsKey && selectedNightsOption && tour.nights?.[selectedNightsKey]?.[selectedNightsOption])
    ? tour.nights[selectedNightsKey][selectedNightsOption].add_price
    : 0;
  const foodAddPrice = (selectedFoodCategory && tour?.food_category?.[selectedFoodCategory])
    ? tour.food_category[selectedFoodCategory][0] * nightsCount * personCount
    : 0;
  const totalPrice = (basePrice * personCount) + nightsAddPrice + foodAddPrice;
  const nightsOldPrice = (tour && selectedNightsKey && selectedNightsOption && tour.nights?.[selectedNightsKey]?.[selectedNightsOption])
    ? tour.nights[selectedNightsKey][selectedNightsOption].old_add_price
    : 0;
  const foodOldPrice = (selectedFoodCategory && tour?.food_category?.[selectedFoodCategory])
    ? tour.food_category[selectedFoodCategory][1] * nightsCount * personCount
    : 0;
  const finalOldPrice = (oldBasePrice * personCount) + nightsOldPrice + foodOldPrice;
  const selectedNightsOptionLabel = (tour && selectedNightsKey && selectedNightsOption && tour.nights?.[selectedNightsKey]?.[selectedNightsOption])
    ? tour.nights[selectedNightsKey][selectedNightsOption].option
    : 'Standard';

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
          src={imageError ? 'https://via.placeholder.com/1200x800?text=Tour+Image' : tour.tour_image}
          alt={`${tour.title} Background`}
          className="absolute inset-0 w-full h-full object-cover object-center z-10"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70 z-20"></div>
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-center text-white max-w-4xl mx-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fadeInUp">
              {tour.title}
            </h1>
            <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto">
              {tour.sum}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => setOpenDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center"
              >
                <Calendar className="mr-2 w-5 h-5" />
                Book This Experience
              </button>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {selectedCurrency} {convertPrice(totalPrice)}
                </div>
                <div className="text-cyan-200">for {personCount} person(s)</div>
              </div>
            </div>
          </div>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-blue-900">{daysCount}</span>
              </div>
              <span className="text-gray-600 font-medium">Days / {nightsCount} Nights</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-emerald-600 mr-2" />
                <span className="text-2xl font-bold text-emerald-900">{personCount}</span>
              </div>
              <span className="text-gray-600 font-medium">Travelers</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-purple-600 mr-2" />
                <span className="text-2xl font-bold text-purple-900">{tour.category}</span>
              </div>
              <span className="text-gray-600 font-medium">Experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Booking Card */}
      <div className="max-w-10xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Package Customization */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/50 p-8 mb-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-500" />
                Customize Your Package
              </h2>
              {/* Duration */}
              {tour?.nights && Object.keys(tour.nights).length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Duration</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.keys(tour.nights).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedNightsKey(key);
                          setSelectedNightsOption(Object.keys(tour.nights[key])[0] || 'standard');
                        }}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 relative ${
                          selectedNightsKey === key
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        title={`${key} Nights (${parseInt(key) + 1} Days)`}
                      >
                        <div className="font-semibold">{key} Nights</div>
                        <div className="text-sm text-gray-500">{parseInt(key) + 1} Days</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600 p-4 bg-gray-50 rounded-lg">
                  Duration: {tour.days - 1} Nights ({tour.days} Days)
                </div>
              )}
              {/* Package Options */}
              {selectedNightsKey && tour?.nights?.[selectedNightsKey] && Object.keys(tour.nights[selectedNightsKey]).length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Package Options</h3>
                  <div className="space-y-3">
                    {Object.keys(tour.nights[selectedNightsKey]).map((optKey) => (
                      <button
                        key={optKey}
                        onClick={() => setSelectedNightsOption(optKey)}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left relative ${
                          selectedNightsOption === optKey
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        title={tour.nights[selectedNightsKey][optKey].option}
                      >
                        <div className="font-medium">{tour.nights[selectedNightsKey][optKey].option}</div>
                        <span className="absolute top-2 right-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          +{selectedCurrency} {convertPrice(tour.nights[selectedNightsKey][optKey].add_price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600 p-4 bg-gray-50 rounded-lg">
                  No package options available.
                </div>
              )}
              {/* Meal Plan */}
              {tour?.food_category && Object.keys(tour.food_category).length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Meal Plan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.keys(tour.food_category)
                      .filter(key => tour.food_category[key][2] === true)
                      .map((key) => (
                        <button
                          key={key}
                          onClick={() => setSelectedFoodCategory(key)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 relative ${
                            selectedFoodCategory === key
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                          title={`${foodCategoryMap[key]} (+${selectedCurrency} ${convertPrice(tour.food_category[key][0] * nightsCount * personCount)} total)`}
                        >
                          <div className="font-medium">{foodCategoryMap[key]}</div>
                          <span className="absolute top-2 right-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            +{selectedCurrency} {convertPrice(tour.food_category[key][0])}/night
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600 p-4 bg-gray-50 rounded-lg">
                  No meal plans available.
                </div>
              )}
              {/* Package Includes */}
              {tour?.inclusions && tour.inclusions.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Package Includes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tour.inclusions.map((inclusion, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{inclusion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600 p-4 bg-gray-50 rounded-lg">
                  No inclusions listed.
                </div>
              )}
            </div>

            {/* Tour Gallery Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/50 p-8 mb-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-red-500" />
                Tour Gallery
              </h2>
              <TourImages
                destinations={tour.destination_images || []}
                activities={tour.activity_images || []}
                hotels={tour.hotel_images || []}
                deviceType={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
              />
            </div>

            {/* Itinerary Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/50 p-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Your Journey Day by Day</h2>
              <Itinerary 
                tourData={tour} 
                selectedNightsKey={selectedNightsKey || String(tour.days - 1)}
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
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Total Price</h3>
                      <DollarSign className="w-6 h-6" />
                    </div>
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
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200 mb-6">
                  <div className="text-center">
                    <DateRangeIcon className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <div className="text-sm font-medium text-orange-800 mb-2">Package Valid</div>
                    <div className="space-y-1">
                      <div className="font-bold text-orange-900">
                        {new Date(tour.valid_from).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-sm text-orange-700">to</div>
                      <div className="font-bold text-orange-900">
                        {new Date(tour.valid_to).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200 mb-6">
                  <div className="text-center">
                    <CalendarMonthIcon className="w-8 h-8 text-red-600 mx-auto mb-3" />
                    <div className="text-sm font-medium text-red-800 mb-2">Expires On</div>
                    <div className="font-bold text-red-900">
                      {new Date(tour.expiry_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => setOpenDialog(true)}
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
                  <button
                    onClick={() => navigate('/tours')}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-2xl font-medium transition-all flex items-center justify-center"
                  >
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back to Tours
                  </button>
                </div>
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

      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      >
        <WhatsAppIcon className="w-6 h-6" />
      </button>

      {/* Inquiry Form Modal */}
      <InquiryForm 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        tourName={tour.title}
        tour={tour}
        selectedNightsKey={selectedNightsKey}
        selectedNightsOption={selectedNightsOption}
        selectedNightsOptionLabel={selectedNightsOptionLabel}
        selectedFood={selectedFoodCategory ? foodCategoryMap[selectedFoodCategory] : 'Half Board'}
        totalPrice={totalPrice}
        selectedCurrency={selectedCurrency}
        convertPrice={convertPrice}
        isMobile={isMobile}
        finalOldPrice={finalOldPrice}
      />
    </div>
  );
};


export default TourDetails;
