import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, ChevronDown, MapPin, Sun, Waves, Calendar, Users } from 'lucide-react';
import ImageGallery from '../components/Home/ImageGallery';
import { useLocation } from 'react-router-dom';

const MALDIVES_IMAGES = {
  hero: "https://i.postimg.cc/50CFBvJT/abdulla-faiz-0-DGZu-Jxta3k-unsplash.jpg",
  ctaBackground: "https://i.postimg.cc/50CFBvJT/abdulla-faiz-0-DGZu-Jxta3k-unsplash.jpg",
  categories: {
    luxury: "https://i.postimg.cc/YqvgFBcR/pexels-asadphoto-3319704.jpg",
    adventure: "https://i.postimg.cc/yxV0xTmn/Screenshot-2025-05-14-132943.png",
    family: "https://i.postimg.cc/gk2HWbJS/photo-1590523741831-ab7e8b8f9c7f.avif",
    wellness: "https://i.postimg.cc/c1gKyPVK/pexels-savindu-senevirathne-2100872112-30942047.jpg"
  }
};

const Tours = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [availableToursCount, setAvailableToursCount] = useState(0);
  const [activeFilterTab, setActiveFilterTab] = useState('categories');
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [],
    duration: [],
    categories: []
  });
  const heroRef = useRef(null);
  const toursRef = useRef(null);
  const statsRef = useRef(null);
  const location = useLocation();
  const isInitialMount = useRef(true);
  
  // Stats counters state with initial values
  const [animatedStats, setAnimatedStats] = useState({
    islands: 0,
    resorts: 0,
    tours: 0,
    travelers: 0
  });
  
  const targetStats = {
    islands: 20,
    resorts: 50,
    tours: 100,
    travelers: 1000
  };
  
  const animationDuration = 1500;
  
  const [hasAnimated, setHasAnimated] = useState(false);

  const popularDestinations = [
    { name: "Luxury", count: 2, image: MALDIVES_IMAGES.categories.luxury },
    { name: "Adventure", count: 2, image: MALDIVES_IMAGES.categories.adventure },
    { name: "Family", count: 1, image: MALDIVES_IMAGES.categories.family },
    { name: "Wellness", count: 1, image: MALDIVES_IMAGES.categories.wellness }
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search') || '';
    const categories = queryParams.get('categories')?.split(',').filter(Boolean) || [];
    const priceRange = queryParams.get('priceRange')?.split(',').filter(Boolean) || [];
    const duration = queryParams.get('duration')?.split(',').filter(Boolean) || [];

    setSearchTerm(search);
    setSelectedFilters({
      categories,
      priceRange,
      duration
    });

    if (queryParams.toString() && isInitialMount.current) {
      if (toursRef.current) {
        toursRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      isInitialMount.current = false;
    }
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check if stats section is in viewport
      if (statsRef.current && !hasAnimated) {
        const rect = statsRef.current.getBoundingClientRect();
        const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
        
        if (isInViewport) {
          animateStats();
          setHasAnimated(true); 
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);
  
  useEffect(() => {
    if (statsRef.current) {
      const rect = statsRef.current.getBoundingClientRect();
      const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
      
      if (isInViewport && !hasAnimated) {
        animateStats();
        setHasAnimated(true);
      }
    }
  }, [hasAnimated]);
  
  const animateStats = () => {
    const startTime = Date.now();
    
    // Animation interval
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      
      const springProgress = progress === 1 
        ? 1 
        : 1 - Math.cos((progress * Math.PI) / 2);
      
      // Update the stats based on progress
      setAnimatedStats({
        islands: Math.floor(springProgress * targetStats.islands),
        resorts: Math.floor(springProgress * targetStats.resorts),
        tours: Math.floor(springProgress * targetStats.tours),
        travelers: Math.floor(springProgress * targetStats.travelers)
      });
      
      if (progress >= 1) {
        clearInterval(interval);
      }
    }, 16); 
    
    return () => clearInterval(interval);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (toursRef.current) {
      toursRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      priceRange: [],
      duration: [],
      categories: []
    });
    setSearchTerm('');
  };

  const removeFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== value)
    }));
  };

  const activeFilters = [
    ...selectedFilters.categories.map(cat => ({ type: 'categories', value: cat })),
    ...selectedFilters.priceRange.map(price => ({ type: 'priceRange', value: price })),
    ...selectedFilters.duration.map(dur => ({ type: 'duration', value: dur }))
  ];

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => {
      const currentFilters = [...prev[category]];
      const index = currentFilters.indexOf(value);
      
      if (index === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(index, 1);
      }
      
      return {
        ...prev,
        [category]: currentFilters
      };
    });
  };

  return (
    <div className="tours-page bg-gray-50">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-screen max-h-[640px] overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-cyan-900/70 z-10"></div>
          <img
            src={MALDIVES_IMAGES.hero}
            alt="Maldives Paradise"
            className="w-full h-full object-cover"
            style={{ 
              transform: `translateY(${scrollY * 0.4}px)`, 
              transition: 'transform 0.05s linear'
            }}
          />
        </div>
        
        <div className="absolute inset-0 z-10 flex items-center px-4">
          <div className="max-w-6xl mx-auto text-white">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/30 text-cyan-50 text-sm font-medium mb-4">
                Experience Paradise
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                Unforgettable <span className="text-cyan-300">Maldives</span> Tours & Experiences
              </h1>
              <p className="text-lg text-cyan-50 mb-8 max-w-lg">
                Discover crystal-clear waters, pristine beaches, and luxury accommodations curated for the perfect getaway.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    if (toursRef.current) {
                      toursRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg font-medium text-white hover:from-cyan-500 hover:to-blue-600 transition shadow-lg hover:shadow-xl"
                >
                  Explore Tours
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search and Filter Section */}
      <section className="relative -mt-20 z-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-800" size={20} />
                  <input
                    type="text"
                    placeholder="Search for tours, activities, destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-4 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
                   <button
                    type="button"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`py-4 px-4 md:px-6 rounded-xl border font-medium transition flex items-center justify-center gap-2 ${isFilterOpen ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-blue-50'}`}
                  >
                    <Filter size={18} />
                    <span className="hidden md:inline">Filters</span>
                  </button>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="py-4 px-6 md:px-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center whitespace-nowrap"
                  >
                    Find Tours
                  </button>
                
                </div>
              </div>
            </form>
            
            {(activeFilters.length > 0 || searchTerm) && (
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 items-center">
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      Search: {searchTerm}
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-2 focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {activeFilters.map((filter, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
                    >
                      {filter.value}
                      <button
                        onClick={() => removeFilter(filter.type, filter.value)}
                        className="ml-2 focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {(activeFilters.length > 0 || searchTerm) && (
                    <button
                      onClick={clearAllFilters}
                      className="text-medium text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {availableToursCount} {availableToursCount === 1 ? 'tour' : 'tours'} available
                </p>
              </div>
            )}

            {isFilterOpen && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                  {['categories', 'duration', 'price'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveFilterTab(tab)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${
                        activeFilterTab === tab 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {activeFilterTab === 'categories' && (
                    <div className="col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {popularDestinations.map((dest, index) => (
                        <div 
                          key={index} 
                          className={`cursor-pointer rounded-xl overflow-hidden relative transition group ${
                            selectedFilters.categories.includes(dest.name) ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => toggleFilter('categories', dest.name)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                          <img src={dest.image} alt={dest.name} className="w-full h-32 object-cover group-hover:scale-110 transition duration-300" />
                          <div className="absolute bottom-0 left-0 p-3 text-white z-10">
                            <p className="font-medium text-sm">{dest.name}</p>
                            <p className="text-xs text-gray-300">{dest.count} tours</p>
                          </div>
                          {selectedFilters.categories.includes(dest.name) && (
                            <div className="absolute top-2 right-2 z-20 bg-blue-500 rounded-full p-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activeFilterTab === 'duration' && (
                    <div className="col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {['1-3 Days', '4-7 Days', '8-14 Days', '15+ Days'].map((duration, index) => (
                        <div 
                          key={index} 
                          className={`cursor-pointer p-4 rounded-lg border transition ${
                            selectedFilters.duration.includes(duration) 
                              ? 'border-blue-500 bg-blue-50/50' 
                              : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
                          }`}
                          onClick={() => toggleFilter('duration', duration)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{duration}</span>
                            {selectedFilters.duration.includes(duration) && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activeFilterTab === 'price' && (
                    <div className="col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {['$0 - $1000', '$1000 - $2000', '$2000 - $3000', '$3000+'].map((price, index) => (
                        <div 
                          key={index} 
                          className={`cursor-pointer p-4 rounded-lg border transition ${
                            selectedFilters.priceRange.includes(price) 
                              ? 'border-blue-500 bg-blue-50/50' 
                              : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
                          }`}
                          onClick={() => toggleFilter('priceRange', price)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{price}</span>
                            {selectedFilters.priceRange.includes(price) && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center gap-4">
                  <button 
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                  <button 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Key Stats Section with Animation */}
      <section className="py-12 px-4" ref={statsRef}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { 
                icon: <MapPin size={24} />, 
                count: animatedStats.islands,
                suffix: "+", 
                label: "Islands",
                target: targetStats.islands
              },
              { 
                icon: <Sun size={24} />, 
                count: animatedStats.resorts,
                suffix: "+", 
                label: "Luxury Resorts",
                target: targetStats.resorts
              },
              { 
                icon: <Waves size={24} />, 
                count: animatedStats.tours,
                suffix: "+", 
                label: "Tour Packages",
                target: targetStats.tours
              },
              { 
                icon: <Users size={24} />, 
                count: animatedStats.travelers,
                suffix: "+", 
                label: "Happy Travelers",
                target: targetStats.travelers
              },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center"
              >
                <div className="rounded-full bg-blue-50 p-3 mb-3 text-blue-500">
                  {stat.icon}
                </div>
                <div className="relative h-12 flex items-center justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-1">
                    {stat.count}{stat.suffix}
                  </h3>
                  {/* Show glowing effect during animation */}
                  {stat.count < stat.target && (
                    <span className="absolute inset-0 animate-pulse bg-blue-300/20 rounded-full" />
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Main Image Gallery */}
      <section className="px-4" ref={toursRef}>
        <div className="max-w-8xl mx-auto">
          <ImageGallery 
            searchQuery={searchTerm} 
            selectedFilters={selectedFilters}
            setAvailableToursCount={setAvailableToursCount}
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-cyan-800 opacity-95 z-0"></div>
        <div className="absolute inset-0 z-0">
          <img
            src={MALDIVES_IMAGES.ctaBackground}
            alt="Maldives beach"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-cyan-400/30 text-cyan-50 text-sm font-medium mb-4">
            Personalized Experience
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-cyan-100 md:text-lg mb-8 max-w-2xl mx-auto">
            Let our travel experts create a personalized itinerary based on your preferences and budget. We'll handle all the details so you can focus on enjoying your dream vacation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => window.location.href = '/contact'}
             className="px-8 py-3 bg-transparent border border-white/40 text-white rounded-lg font-medium hover:bg-white/10 transition">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tours;