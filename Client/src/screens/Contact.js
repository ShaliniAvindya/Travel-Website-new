import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, User, MessageSquare, Clock, Info, CheckCircle, X } from 'lucide-react';
import FAQAccordion from './FAQAccordion';
import axios from 'axios'; 

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const formRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:8000/api/contact', formData);
      setNotificationType('success');
      setNotificationMessage(response.data.message || 'Your message has been sent successfully! We will contact you soon.');
      setShowNotification(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setNotificationType('error');
      setNotificationMessage(error.response?.data?.message || 'Something went wrong. Please try again later.');
      setShowNotification(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  };

  return (
    <div className="font-sans bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[76vh] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-cyan-800/75 z-10"></div>
          <img
            src="https://i.postimg.cc/7hs76b6B/beautiful-shot-cute-dolphins-hanging-out-underwater-bimini-bahamas.jpg"
            alt="Maldives aerial view"
            className="w-full h-full object-cover"
            style={{
              transform: `translateY(${scrollY * 0.4}px)`,
              willChange: 'transform',
              transition: 'transform 0.05s linear',
            }}
          />
        </div>

        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 animate-fade-in">Get In Touch</h1>
            <div className="w-20 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <p className="text-lg sm:text-xl text-cyan-50 max-w-2xl mx-auto leading-relaxed">
              We're here to help plan your perfect Maldives getaway. Reach out to our travel experts today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="relative z-30 -mt-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl shadow-xl p-10 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-cyan-500">
            <div className="inline-flex h-14 w-14 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-600 items-center justify-center mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm mb-2">Available 24/7</p>
            <a href="tel:+9603456789" className="text-blue-600 hover:text-blue-800 font-medium text-base transition-colors">
              +960 345 6789
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-6 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-blue-600">
            <div className="inline-flex h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 items-center justify-center mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm mb-2">Reply within 24 hours</p>
            <a href="mailto:info@maldivesparadise.com" className="text-blue-600 hover:text-blue-800 font-medium text-base transition-colors">
              info@maldivesparadise.com
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-6 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-cyan-400">
            <div className="inline-flex h-14 w-14 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-600 items-center justify-center mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Office Hours</h3>
            <p className="text-gray-600 text-sm mb-2">Monday - Saturday</p>
            <p className="text-blue-600 font-medium text-base">9:00 AM - 8:00 PM</p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-blue-900 mb-3 tracking-tight">Send Us a Message</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mb-4 rounded-full"></div>
                <p className="text-gray-600 text-base leading-relaxed">
                  Questions about Maldives packages or trip planning? Our travel specialists are here to assist.
                </p>
              </div>
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full py-3 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full py-3 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 w-full py-3 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                        <Info className="h-4 w-4" />
                      </div>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full py-3 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none text-sm"
                      >
                        <option value="">Select a subject</option>
                        <option value="Booking Inquiry">Booking Inquiry</option>
                        <option value="Package Information">Package Information</option>
                        <option value="Custom Trip Planning">Custom Trip Planning</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <div className="relative group">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      required
                      className="pl-10 w-full py-3 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="privacy"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="/privacy-policy" className="text-blue-600 hover:underline font-medium">privacy policy</a>
                  </label>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 flex justify-center items-center rounded-lg text-white font-medium transition-all shadow-md text-base
                      ${isSubmitting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:shadow-lg'}`}
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="inline-flex items-center">
                        Send Message <Send className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Contact Details and Map */}
            <div className="flex flex-col space-y-8">
              <div className="bg-gradient-to-br from-blue-900 to-cyan-800 text-white rounded-2xl p-10 shadow-xl border border-cyan-700/50">
                <h3 className="text-2xl font-bold mb-8 text-cyan-100">Visit Our Office</h3>
                
                <div className="space-y-8">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-5">
                      <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-cyan-300" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-cyan-300 mb-2">Main Office</h4>
                      <p className="text-cyan-50 text-base">
                        Paradise Building, Malé 20026<br />
                        Republic of Maldives
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mr-5">
                      <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-cyan-300" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-cyan-300 mb-2">Email Us</h4>
                      <p className="text-cyan-50 text-base">info@maldivesparadise.com</p>
                      <p className="text-cyan-50 text-base">bookings@maldivesparadise.com</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mr-5">
                      <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center">
                        <Phone className="h-6 w-6 text-cyan-300" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-cyan-300 mb-2">Call Us</h4>
                      <p className="text-cyan-50 text-base">+960 345 6789 (Bookings)</p>
                      <p className="text-cyan-50 text-base">+960 345 6780 (Customer Service)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FAQAccordion />
      {/* Notification */}
      {showNotification && (
        <div
          className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg z-50 text-white flex items-center max-w-md transition-all transform translate-y-0 ${
            notificationType === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          <div className="flex-shrink-0 mr-3">
            {notificationType === 'success' ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div>{notificationMessage}</div>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-auto text-white hover:text-gray-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
