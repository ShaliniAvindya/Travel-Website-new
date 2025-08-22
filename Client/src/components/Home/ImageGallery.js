import React, { useEffect, useState } from 'react';
import { Calendar, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const ImageGallery = ({ searchQuery = '', selectedFilters = { categories: [], priceRange: [], duration: [] }, setAvailableToursCount = () => {} }) => {
  const { isMobile } = useDeviceType();
  const [activeTab, setActiveTab] = useState('all');
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch tours 
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/tours');
        setTours(response.data);
        const uniqueCategories = [...new Set(response.data.map(tour => tour.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching tours:', error);
        setError('Failed to load tours. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleClick = (id) => {
    navigate(`/tours/${id}`);
  };

  const filteredTours = (() => {
    let results = tours;

    if (searchQuery && searchQuery.trim() !== '') {
      const term = searchQuery.toLowerCase();
      results = results.filter(tour =>
        tour.title.toLowerCase().includes(term) ||
        tour.tour_summary.toLowerCase().includes(term) ||
        tour.category.toLowerCase().includes(term)
      );
    }

    if (selectedFilters.categories?.length > 0) {
      results = results.filter(tour => selectedFilters.categories.includes(tour.category));
    }

    if (selectedFilters.priceRange?.length > 0) {
      results = results.filter(tour => {
        return selectedFilters.priceRange.some(range => {
          if (range === '$0 - $1000') return tour.price <= 1000;
          if (range === '$1000 - $2000') return tour.price > 1000 && tour.price <= 2000;
          if (range === '$2000 - $3000') return tour.price > 2000 && tour.price <= 3000;
          if (range === '$3000+') return tour.price > 3000;
          return false;
        });
      });
    }

    if (selectedFilters.duration?.length > 0) {
      results = results.filter(tour => {
        return selectedFilters.duration.some(range => {
          if (range === '1-3 Days') return tour.days >= 1 && tour.days <= 3;
          if (range === '4-7 Days') return tour.days >= 4 && tour.days <= 7;
          if (range === '8-14 Days') return tour.days >= 8 && tour.days <= 14;
          if (range === '15+ Days') return tour.days >= 15;
          return false;
        });
      });
    }

    if (activeTab !== 'all') {
      results = results.filter(tour => tour.category === activeTab);
    }

    return results;
  })();

  useEffect(() => {
    setAvailableToursCount(filteredTours.length);
  }, [filteredTours, setAvailableToursCount]);

  if (isLoading) {
    return <div className="text-center py-16">Loading tours...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <section id="tours" className="py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Explore Our Tours</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the perfect package for your dream Maldives vacation
          </p>
        </div>

        <div className="flex flex-wrap justify-center mb-8 gap-2">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 rounded-full transition ${
              activeTab === 'all' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Tours
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleTabChange(category)}
              className={`px-4 py-2 rounded-full transition ${
                activeTab === category ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <div
              key={tour._id}
              className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-2xl hover:translate-y-1"
            >
              <div className="relative">
                <img
                  src={tour.tour_image}
                  alt={tour.title}
                  className="w-full h-64 object-cover"
                  onClick={() => handleClick(tour._id)}
                />
                <button className="absolute top-4 right-4 bg-white p-2 rounded-full text-gray-600 hover:text-red-500 transition">
                  <Heart size={20} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white py-2 text-center">
                  <p className="text-sm font-medium">
                    {tour.days} days & {tour.days - 1} nights
                  </p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {tour.category}
                  </span>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400" />
                    <span className="text-gray-700 ml-1">{(Math.random() * (5 - 4) + 4).toFixed(1)}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{tour.tour_summary}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar size={16} className="mr-1" />
                    <span>{tour.days} days</span>
                  </div>
                  <div className="text-blue-900 font-bold text-lg">
                    ${tour.price.toLocaleString()}
                    <span className="text-gray-500 font-normal text-sm">/person</span>
                  </div>
                </div>
                <button
                  onClick={() => handleClick(tour._id)}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg transition duration-300"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tours found matching your criteria. Please try a different search.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageGallery;
