import { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, ArrowRight, Filter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Header({ scrollToBooking }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('categories');
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [],
    duration: [],
    categories: [],
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('/');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/tours/stats');
        setCategories(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/users/check-auth', { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Set activeTab based on current pathname
    if (location.pathname.startsWith('/tours')) {
      setActiveTab('/tours');
    } else {
      setActiveTab(location.pathname || '/');
    }

    if (headerRef.current) {
      if (location.pathname.startsWith('/admin')) {
        headerRef.current.style.background = '#224272ff';
      } else {
        headerRef.current.style.background = 'transparent';
      }
    }
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 50) {
          headerRef.current.style.background = 'rgba(1, 30, 65, 0.95)';
        } else if (location.pathname.startsWith('/admin')) {
          headerRef.current.style.background = '#224272ff';
        } else {
          headerRef.current.style.background = 'transparent';
        }
        headerRef.current.style.padding = '0.1rem 0';
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTabClick = (path) => {
    setActiveTab(path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveTab('/tours');
    const queryParams = new URLSearchParams();
    if (searchQuery) {
      queryParams.append('search', searchQuery);
    }
    if (selectedFilters.categories.length > 0) {
      queryParams.append('categories', selectedFilters.categories.join(','));
    }
    if (selectedFilters.priceRange.length > 0) {
      queryParams.append('priceRange', selectedFilters.priceRange.join(','));
    }
    if (selectedFilters.duration.length > 0) {
      queryParams.append('duration', selectedFilters.duration.join(','));
    }
    navigate(`/tours?${queryParams.toString()}`);
    setIsSearchOpen(false);
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      priceRange: [],
      duration: [],
      categories: [],
    });
    setSearchQuery('');
  };

  const removeFilter = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== value),
    }));
  };

  const activeFilters = [
    ...selectedFilters.categories.map((cat) => ({ type: 'categories', value: cat })),
    ...selectedFilters.priceRange.map((price) => ({ type: 'priceRange', value: price })),
    ...selectedFilters.duration.map((dur) => ({ type: 'duration', value: dur })),
  ];

  const toggleFilter = (category, value) => {
    setSelectedFilters((prev) => {
      const currentFilters = [...prev[category]];
      const index = currentFilters.indexOf(value);

      if (index === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(index, 1);
      }

      return {
        ...prev,
        [category]: currentFilters,
      };
    });
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-opacity-10 bg-blue-950"
      style={{ background: 'transparent', padding: '0.1rem 0', transition: 'all 0.3s cubic-bezier(.4,0,.2,1)' }}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between py-2">
        <div className="flex items-center">
          <div className="text-white font-bold text-2xl">
            <span className="text-cyan-300">Travel</span> Paradise
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <a
            href="/"
            onClick={() => handleTabClick('/')}
            className={`text-white hover:text-cyan-300 transition-colors text-lg font-medium py-2 px-4 border-b-2 ${
              activeTab === '/' ? 'border-cyan-300 text-cyan-300' : 'border-transparent'
            }`}
          >
            Home
          </a>
          <a
            href="/tours"
            onClick={() => handleTabClick('/tours')}
            className={`text-white hover:text-cyan-300 transition-colors text-lg font-medium py-2 px-4 border-b-2 ${
              activeTab === '/tours' ? 'border-cyan-300 text-cyan-300' : 'border-transparent'
            }`}
          >
            Tours
          </a>
          <a
            href="/contact"
            onClick={() => handleTabClick('/contact')}
            className={`text-white hover:text-cyan-300 transition-colors text-lg font-medium py-2 px-4 border-b-2 ${
              activeTab === '/contact' ? 'border-cyan-300 text-cyan-300' : 'border-transparent'
            }`}
          >
            Contact
          </a>
          {isAuthenticated && (
            <>
              <a
                href="/admin"
                onClick={e => {
                  e.preventDefault();
                  handleTabClick('/admin');
                  if (isAuthenticated) {
                    navigate('/admin');
                  } else {
                    navigate('/login');
                  }
                }}
                className={`text-white hover:text-cyan-300 transition-colors text-medium font-medium py-2 px-4 border-b-2 ${
                  activeTab === '/admin' ? 'border-cyan-300 text-cyan-300' : 'border-transparent'
                }`}
              >
                Admin
              </a>
              <button
                onClick={handleLogout}
                className="text-white hover:text-cyan-300 transition-colors text-medium font-medium py-2 px-4"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <button onClick={handleSearchToggle} className="text-white p-2 rounded-full hover:bg-blue-800 transition">
            <Search size={20} />
          </button>
          <button
            onClick={() => (window.location.href = '/tours')}
            className="bg-cyan-700 hover:bg-blue-900 text-white px-6 py-3 rounded-full transition duration-300 flex items-center"
          >
            Book Now
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={handleSearchToggle} className="text-white mr-2">
            <Search size={20} />
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-900 p-4">
          <nav className="flex flex-col space-y-3">
            <a
              href="/"
              className={`text-lg py-3 px-4 rounded-medium transition-colors ${
                activeTab === '/' ? 'bg-blue-800 text-cyan-300 font-medium' : 'text-white hover:bg-blue-800'
              }`}
              onClick={() => {
                handleTabClick('/');
                setIsMenuOpen(false);
              }}
            >
              Home
            </a>
            <a
              href="/tours"
              className={`text-lg py-3 px-4 rounded-medium transition-colors ${
                activeTab === '/tours' ? 'bg-blue-800 text-cyan-300 font-medium' : 'text-white hover:bg-blue-800'
              }`}
              onClick={() => {
                handleTabClick('/tours');
                setIsMenuOpen(false);
              }}
            >
              Tours
            </a>
            <a
              href="/contact"
              className={`text-lg py-3 px-4 rounded-medium transition-colors ${
                activeTab === '/contact' ? 'bg-blue-800 text-cyan-300 font-medium' : 'text-white hover:bg-blue-800'
              }`}
              onClick={() => {
                handleTabClick('/contact');
                setIsMenuOpen(false);
              }}
            >
              Contact
            </a>
            {isAuthenticated && (
              <>
                <a
                  href="/admin"
                  className={`text-lg py-3 px-4 rounded-medium transition-colors ${
                    activeTab === '/admin' ? 'bg-blue-800 text-cyan-300 font-medium' : 'text-white hover:bg-blue-800'
                  }`}
                  onClick={e => {
                    e.preventDefault();
                    handleTabClick('/admin');
                    setIsMenuOpen(false);
                    if (isAuthenticated) {
                      navigate('/admin');
                    } else {
                      navigate('/login');
                    }
                  }}
                >
                  Admin
                </a>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-lg py-3 px-4 rounded-medium text-white hover:bg-blue-800 text-left"
                >
                  Logout
                </button>
              </>
            )}
            <button
              onClick={() => {
                window.location.href = '/tours';
                setIsMenuOpen(false);
              }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 rounded-full transition duration-300 flex items-center w-full justify-center text-lg"
            >
              Book Now
              <ArrowRight size={16} className="ml-2" />
            </button>
          </nav>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50">
          <div className="container mx-auto px-4 py-6">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-800" size={20} />
                  <input
                    type="text"
                    placeholder="Search for tours, activities, destinations..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full py-4 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`py-4 px-4 md:px-6 rounded-xl border font-medium transition flex items-center justify-center gap-2 ${
                    isFilterOpen
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-blue-50'
                  }`}
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
                  <button
                    type="button"
                    onClick={handleSearchToggle}
                    className="py-4 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 font-medium transition flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </form>
            {(activeFilters.length > 0 || searchQuery) && (
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 items-center">
                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                      Search: {searchQuery}
                      <button onClick={() => setSearchQuery('')} className="ml-2 focus:outline-none">
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
                  {(activeFilters.length > 0 || searchQuery) && (
                    <button
                      onClick={clearAllFilters}
                      className="text-medium text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
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
                      {isLoading ? (
                        <div className="col-span-full text-center text-gray-600">Loading categories...</div>
                      ) : error ? (
                        <div className="col-span-full text-center text-red-600">{error}</div>
                      ) : categories.length === 0 ? (
                        <div className="col-span-full text-center text-gray-600">No categories available</div>
                      ) : (
                        categories.map((dest, index) => (
                          <div
                            key={index}
                            className={`cursor-pointer rounded-xl overflow-hidden relative transition group ${
                              selectedFilters.categories.includes(dest.name) ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => toggleFilter('categories', dest.name)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                            <img
                              src={dest.image || 'https://via.placeholder.com/150'}
                              alt={dest.name}
                              className="w-full h-32 object-cover group-hover:scale-110 transition duration-300"
                            />
                            <div className="absolute bottom-0 left-0 p-3 text-white z-10">
                              <p className="font-medium text-sm">{dest.name}</p>
                              <p className="text-xs text-gray-300">{dest.count} tours</p>
                            </div>
                            {selectedFilters.categories.includes(dest.name) && (
                              <div className="absolute top-2 right-2 z-20 bg-blue-500 rounded-full p-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-white"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                            )}
                          </div>
                        ))
                      )}
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
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-500"
                              >
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
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-500"
                              >
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
      )}
    </header>
  );
}
