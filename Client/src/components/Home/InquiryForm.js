import React, { useState, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const foodCategoryMap = {
  0: 'Half Board',
  1: 'Full Board',
  2: 'All Inclusive'
};

// Country codes for phone number selection
const countryCodes = [
  { code: '+1', label: '🇺🇸' },
  { code: '+44', label: '🇬🇧' },
  { code: '+91', label: '🇮🇳' },
  { code: '+61', label: '🇦🇺' },
  { code: '+49', label: '🇩🇪' },
  { code: '+33', label: '🇫🇷' },
  { code: '+81', label: '🇯🇵' },
  { code: '+86', label: '🇨🇳' },
  { code: '+971', label: '🇦🇪' },
  { code: '+7', label: '🇷🇺' },
  { code: '+55', label: '🇧🇷' },
  { code: '+34', label: '🇪🇸' },
  { code: '+39', label: '🇮🇹' },
  { code: '+82', label: '🇰🇷' },
  { code: '+92', label: '🇵🇰' },
  { code: '+90', label: '🇹🇷' },
  { code: '+27', label: '🇿🇦' },
  { code: '+234', label: '🇳🇬' },
  { code: '+20', label: '🇪🇬' },
  { code: '+351', label: '🇵🇹' },
  { code: '+31', label: '🇳🇱' },
  { code: '+46', label: '🇸🇪' },
  { code: '+41', label: '🇨🇭' },
  { code: '+32', label: '🇧🇪' },
  { code: '+43', label: '🇦🇹' },
  { code: '+47', label: '🇳🇴' },
  { code: '+45', label: '🇩🇰' },
  { code: '+380', label: '🇺🇦' },
  { code: '+66', label: '🇹🇭' },
  { code: '+65', label: '🇸🇬' },
  { code: '+64', label: '🇳🇿' },
  { code: '+63', label: '🇵🇭' },
  { code: '+60', label: '🇲🇾' },
  { code: '+62', label: '🇮🇩' },
  { code: '+58', label: '🇻🇪' },
  { code: '+57', label: '🇨🇴' },
  { code: '+56', label: '🇨🇱' },
  { code: '+52', label: '🇲🇽' },
  { code: '+51', label: '🇵🇪' },
  { code: '+48', label: '🇵🇱' },
  { code: '+40', label: '🇷🇴' },
  { code: '+420', label: '🇨🇿' },
  { code: '+36', label: '🇭🇺' },
  { code: '+98', label: '🇮🇷' },
  { code: '+212', label: '🇲🇦' },
  { code: '+213', label: '🇩🇿' },
  { code: '+216', label: '🇹🇳' },
  { code: '+94', label: '🇱🇰' },
  { code: '+880', label: '🇧🇩' },
  { code: '+972', label: '🇮🇱' },
  { code: '+353', label: '🇮🇪' },
  { code: '+354', label: '🇮🇸' },
  { code: '+505', label: '🇳🇮' },
  { code: '+509', label: '🇭🇹' },
  { code: '+93', label: '🇦🇫' },
  { code: '+995', label: '🇬🇪' },
  { code: '+374', label: '🇦🇲' },
  { code: '+993', label: '🇹🇲' },
  { code: '+998', label: '🇺🇿' },
  { code: '+675', label: '🇵🇬' },
  { code: '+679', label: '🇫🇯' },
  { code: '+676', label: '🇹🇴' },
  { code: '+960', label: '🇲🇻' },
  { code: '+248', label: '🇸🇨' },
  { code: '+267', label: '🇧🇼' },
  { code: '+254', label: '🇰🇪' },
  { code: '+255', label: '🇹🇿' },
  { code: '+256', label: '🇺🇬' },
  { code: '+233', label: '🇬🇭' },
  { code: '+225', label: '🇨🇮' },
  { code: '+221', label: '🇸🇳' },
  { code: '+218', label: '🇱🇾' },
  { code: '+964', label: '🇮🇶' },
  { code: '+967', label: '🇾🇪' },
  { code: '+965', label: '🇰🇼' },
  { code: '+966', label: '🇸🇦' },
  { code: '+973', label: '🇧🇭' },
  { code: '+974', label: '🇶🇦' },
  { code: '+968', label: '🇴🇲' },
  { code: '+961', label: '🇱🇧' },
  { code: '+963', label: '🇸🇾' },
  { code: '+249', label: '🇸🇩' },
  { code: '+211', label: '🇸🇸' },
  { code: '+975', label: '🇧🇹' },
  { code: '+977', label: '🇳🇵' },
  { code: '+856', label: '🇱🇦' },
  { code: '+855', label: '🇰🇭' },
  { code: '+852', label: '🇭🇰' },
  { code: '+853', label: '🇲🇴' },
  { code: '+373', label: '🇲🇩' },
  { code: '+381', label: '🇷🇸' },
  { code: '+382', label: '🇲🇪' },
  { code: '+389', label: '🇲🇰' },
];

const InquiryForm = ({
  open,
  onClose,
  tourName,
  tour,
  selectedCurrency,
  convertPrice,
  isMobile,
  totalPrice,
  finalOldPrice,
  selectedNightsKey,
  selectedNightsOption,
  selectedNightsOptionLabel,
  selectedFood,
}) => {
  // Local state for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumber1, setPhoneNumber1] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellerCount, setTravellerCount] = useState('');
  const [message, setMessage] = useState('');
  const [countryCodeOpen, setCountryCodeOpen] = useState(false);
  const [filteredCountryCodes, setFilteredCountryCodes] = useState(countryCodes);

  // Initialize travellerCount with tour.person_count
  useEffect(() => {
    if (open && tour && tour.person_count) {
      setTravellerCount(tour.person_count.toString());
    } else {
      setTravellerCount('');
    }
  }, [open, tour]);

  // Reset form and close dialog
  const handleClose = () => {
    setName('');
    setEmail('');
    setPhoneNumber('');
    setPhoneNumber1('');
    setTravelDate('');
    setTravellerCount(tour?.person_count?.toString() || '');
    setMessage('');
    setCountryCodeOpen(false);
    setFilteredCountryCodes(countryCodes);
    onClose();
  };

  // Handle country code search
  const handleCountryCodeSearch = (e) => {
    const search = e.target.value.toLowerCase();
    setFilteredCountryCodes(
      countryCodes.filter(
        (option) =>
          option.code.toLowerCase().includes(search) ||
          option.label.toLowerCase().includes(search)
      )
    );
  };

  const handleSubmitInquiry = async () => {
    if (!name || !email || !phoneNumber || !phoneNumber1 || !travelDate || !travellerCount) {
      Swal.fire('Error!', 'Please fill all required fields.', 'error');
      return;
    }

    try {
      const nightsOption = selectedNightsOptionLabel || selectedNightsOption || 'Standard';
      const foodCategoryLabel = selectedFood || 'Half Board';
      const numericNightsKey = selectedNightsKey ? parseInt(selectedNightsKey, 10) : (tour?.days ? tour.days - 1 : 0);

      const payload = {
        name,
        email,
        phone_number: `${phoneNumber} ${phoneNumber1}`,
        travel_date: new Date(travelDate).toISOString(),
        traveller_count: parseInt(travellerCount, 10),
        message,
        tour: tourName || 'Unknown Tour',
        final_price: totalPrice || 0,
        currency: selectedCurrency || 'USD',
        selected_nights_key: numericNightsKey,
        selected_nights_option: nightsOption,
        selected_food_category: foodCategoryLabel,
      };

      await axios.post('http://localhost:8000/api/inquiries', payload);
      Swal.fire('Success!', 'Your inquiry has been submitted successfully.', 'success');
      handleClose();
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      Swal.fire('Error!', 'Failed to submit inquiry. Please try again.', 'error');
    }
  };

  const displayNights = selectedNightsKey
    ? `${selectedNightsKey} Nights`
    : tour?.days
      ? `${tour.days - 1} Nights`
      : 'N/A';
  const displayOption = selectedNightsOptionLabel || selectedNightsOption || 'Standard';
  const displayFood = selectedFood || 'Half Board';
  const displayTravellers = travellerCount || tour?.person_count?.toString() || 'N/A';

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className={`bg-white ${isMobile ? 'w-[95vw] rounded-[10px]' : 'w-[35vw] rounded-[16px]'} shadow-2xl max-h-[90vh] min-h-[400px] overflow-y-auto backdrop-blur-sm relative overflow-x-hidden`}>
        {/* Header with Tour Image and Title */}
        <div className="bg-gradient-to-r from-blue-900 to-cyan-900 text-white p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            {tour?.tour_image && (
              <img
                src={tour.tour_image}
                alt={tourName}
                className="w-[60px] h-[60px] object-cover rounded-[4px]"
              />
            )}
            <div>
              <h2 className="text-[1.25rem] font-semibold">{tourName || 'Plan Your Escape'}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-[1.15rem] font-bold">{selectedCurrency} {convertPrice(totalPrice || 0)}</span>
                {finalOldPrice > totalPrice && (
                  <>
                    <span className="text-[0.9rem] line-through text-cyan-200">{selectedCurrency} {convertPrice(finalOldPrice || 0)}</span>
                    <span className="bg-green-600 text-white text-[0.75rem] font-bold px-2 py-0.5 rounded-[4px]">
                      SAVE {selectedCurrency} {convertPrice(finalOldPrice - totalPrice)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-cyan-200 p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Your Selections */}
        <div className="bg-gradient-to-b from-blue-50 to-cyan-50 p-4">
          <h3 className="text-[1.125rem] font-bold text-blue-900 mb-2">Your Selections</h3>
          <div className="grid grid-cols-2 gap-3 text-gray-700 text-[0.875rem]">
            <div>
              <p className="font-medium">Nights</p>
              <p className="font-semibold">{displayNights}</p>
            </div>
            <div>
              <p className="font-medium">Option</p>
              <p className="font-semibold">{displayOption}</p>
            </div>
            <div>
              <p className="font-medium">Food Category</p>
              <p className="font-semibold">{displayFood}</p>
            </div>
            <div>
              <p className="font-medium">Travellers</p>
              <p className="font-semibold">{displayTravellers}</p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-4 space-y-3">
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-[1rem]"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-[1rem]"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex space-x-2">
            <div className="relative w-[200px]">
              <label className="block text-[0.875rem] font-medium text-gray-700 mb-1">Country Code *</label>
              <button
                type="button"
                onClick={() => setCountryCodeOpen(!countryCodeOpen)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-left text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-[1rem]"
              >
                {phoneNumber || 'Select Code'}
              </button>
              {countryCodeOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Search code..."
                    onChange={handleCountryCodeSearch}
                    className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none text-[1rem]"
                  />
                  {filteredCountryCodes.map((option) => (
                    <button
                      key={option.code}
                      onClick={() => {
                        setPhoneNumber(option.code);
                        setCountryCodeOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors flex items-center space-x-2 text-[1rem]"
                    >
                      <span>{option.label}</span>
                      <span>{option.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-[0.875rem] font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={phoneNumber1}
                onChange={(e) => setPhoneNumber1(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-[1rem]"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-[0.875rem] font-medium text-gray-700 mb-1">Travel Date *</label>
              <input
                type="date"
                required
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-[1rem]"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-[0.875rem] font-medium text-gray-700 mb-1">Traveller Count *</label>
              <input
                type="number"
                required
                min="1"
                value={travellerCount}
                onChange={(e) => setTravellerCount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-[1rem]"
                placeholder="Number of travellers"
              />
            </div>
          </div>
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none text-[1rem]"
              placeholder="Tell us about your preferences..."
              rows="3"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4 bg-gray-50 flex justify-center sticky bottom-0">
          <button
            onClick={handleSubmitInquiry}
            className="bg-gradient-to-r from-[#016170] to-cyan-600 hover:from-[#016170] hover:to-cyan-500 text-white px-4 py-2 rounded-lg text-[1rem] font-bold transition transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
          >
            Connect with an Expert
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;
