
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = useCallback((id) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -80; 
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  }, []);

  const handleNav = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(() => scrollToSection(sectionId), 300);
    } else {
      scrollToSection(sectionId);
    }
  };

  return (
    <footer className="bg-blue-950 text-white pt-8 pb-8 w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          <div className="md:col-span-1">
            <div className="text-2xl font-bold mb-6">
              <span className="text-cyan-300">Travel</span> Paradise
            </div>
            <p className="text-cyan-100 mb-6">
              Your gateway to unforgettable experiences in the breathtaking Maldives islands.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-900 p-2 rounded-full hover:bg-blue-800 transition-colors hover:text-cyan-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-blue-900 p-2 rounded-full hover:bg-blue-800 transition-colors hover:text-cyan-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-blue-900 p-2 rounded-full hover:bg-blue-800 transition-colors hover:text-cyan-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-cyan-100 hover:text-white transition">Home</a></li>
              <li><a href="/tours" className="text-cyan-100 hover:text-white transition">Tours</a></li>
              <li><a href="/#about" className="text-cyan-100 hover:text-white transition" onClick={e => handleNav(e, 'about')}>About Us</a></li>
              <li><a href="/#testimonials" className="text-cyan-100 hover:text-white transition" onClick={e => handleNav(e, 'testimonials')}>Testimonials</a></li>
              <li><a href="/contact" className="text-cyan-100 hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 mt-1 flex-shrink-0 text-cyan-300" />
                <span className="text-cyan-100">123 Paradise Avenue, Malé, Maldives</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 flex-shrink-0 text-cyan-300" />
                <a href="tel:+1234567890" className="text-cyan-100 hover:text-white transition">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 flex-shrink-0 text-cyan-300" />
                <a href="mailto:info@maldivesparadise.com" className="text-cyan-100 hover:text-white transition">info@maldivesparadise.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-cyan-200 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Maldives Paradise Travels. All rights reserved.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-cyan-200 hover:text-white text-sm transition">Privacy Policy</a>
              <a href="#" className="text-cyan-200 hover:text-white text-sm transition">Terms & Conditions</a>
              <a href="#" className="text-cyan-200 hover:text-white text-sm transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}