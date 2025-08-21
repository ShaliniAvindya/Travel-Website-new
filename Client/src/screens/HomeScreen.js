import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Image, Star, ArrowRight, Palmtree, Anchor, Sunset, Umbrella } from 'lucide-react';
import ImageGallery from '../components/Home/ImageGallery';
import Experience from '../components/Home/Experience';

// Counter Component
const Counter = ({ end, duration = 2000, label }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime;
          let animationFrame;
          
          const countUp = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            const easeOutValue = 1 - Math.pow(1 - percentage, 3);
            setCount(Math.floor(easeOutValue * end));

            if (percentage < 1) {
              animationFrame = requestAnimationFrame(countUp);
            }
          };

          animationFrame = requestAnimationFrame(countUp);
          
          observer.disconnect();
          
          return () => {
            cancelAnimationFrame(animationFrame);
          };
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.disconnect();
      }
    };
  }, [end, duration]);

  return (
    <div className="text-center p-4" ref={countRef}>
      <div className="text-4xl md:text-5xl lg:text-4xl font-bold text-blue-900 mb-2">
        {count}{label.includes("Rate") ? "%" : "+"}
      </div>
      <div className="text-sm md:text-base font-medium text-gray-700">
        {label}
      </div>
    </div>
  );
};

export default function MaldivesParadiseTravels() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const headerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  const heroSlides = [
    {
      id: 1,
      image: "https://i.postimg.cc/76pCMfrN/pexels-asadphoto-2245290.jpg",
      title: "Experience Paradise in the Maldives",
      subtitle: "Discover crystal waters and pristine beaches"
    },
    {
      id: 2,
      image: "https://i.postimg.cc/k4MRXkFx/maldives-3793871_1280.jpg",
      title: "Luxury Resorts & Private Villas",
      subtitle: "Indulge in unparalleled comfort and opulence"
    },
    {
      id: 3,
      image: "https://i.postimg.cc/D00bh5pQ/photo-1743657106173-65fc69fa0923.avif",
      title: "Exclusive Luxury Island Retreats",
      subtitle: "Explore vibrant coral reefs and marine life"
    }
  ];

  const testimonialsData = [
    {
      id: 1,
      text: "Our honeymoon in the Maldives was absolutely magical. The overwater villa was spectacular, and the staff went above and beyond to make our stay special.",
      author: "Sarah & Michael",
      location: "London, UK",
      rating: 5,
      image: "https://i.postimg.cc/rp2W41zc/download.png"
    },
    {
      id: 2,
      text: "The island hopping tour exceeded our expectations. We saw so many beautiful places and the guides were incredibly knowledgeable about marine life.",
      author: "James Peterson",
      location: "Sydney, Australia",
      rating: 5,
      image: "https://i.postimg.cc/W1kgtWNX/download.jpg"
    },
    {
      id: 3,
      text: "The diving experiences were incredible! We saw manta rays, whale sharks, and countless tropical fish. Best vacation ever!",
      author: "Elena Rodriguez",
      location: "Barcelona, Spain",
      rating: 5,
      image: "https://i.postimg.cc/MG0BmnjB/images.jpg"
    }
  ];
  
  const instagramImages = [
    "https://i.postimg.cc/3rCj7X4t/chelsea-gates-0653-w-Y0n-Rc-unsplash.jpg",
    "https://i.postimg.cc/x8TX9bhZ/hawk-hassaan-b-NNS4in-Ra38-unsplash.jpg",
    "https://i.postimg.cc/zGPS6qb5/rayyu-maldives-4-F4-Otn-Njpmc-unsplash.jpg",
    "https://i.postimg.cc/BQjzmZn5/roberto-nickson-d-PBdgc-SXHXY-unsplash.jpg",
    "https://i.postimg.cc/Bv4b1Dzm/photo-1512100356356-de1b84283e18.avif",
    "https://i.postimg.cc/HWBJBB71/rayyu-maldives-Vy-Ee-KOwo3t0-unsplash.jpg"
  ];

  const activities = [
    { id: 1, name: "Handpicked Locations", para: "Curated selection of the most stunning destinations across the Maldives", icon: <Anchor className="w-8 h-8" /> },
    { id: 2, name: "Expert Guides", para: "Local experts with deep knowledge of Maldivian culture and hidden gems", icon: <Palmtree className="w-8 h-8" /> },
    { id: 3, name: "Personalized Experience", para: "Customized itineraries designed around your preferences and interests", icon: <Sunset className="w-8 h-8" /> },
    { id: 4, name: "Premium Service", para: "Five-star support from booking to return with 24/7 assistance", icon: <Umbrella className="w-8 h-8" /> }
  ];

  const statsData = [
    { value: 1000, label: "Happy Customers" },
    { value: 20, label: "Island Destinations" },
    { value: 10, label: "Exclusive Resorts" },
    { value: 100, label: "Satisfaction Rate" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % heroSlides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 50) {
          headerRef.current.style.background = 'rgba(1, 30, 65, 0.95)';
          headerRef.current.style.padding = '0.5rem 0';
        } else {
          headerRef.current.style.background = 'transparent';
          headerRef.current.style.padding = '1rem 0';
        }
      }
      
      setScrollY(window.scrollY);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSlideChange = (direction) => {
    if (direction === 'next') {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    } else {
      setCurrentSlide((prevSlide) => (prevSlide - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  const bookingFormRef = useRef(null);
  const scrollToBooking = () => {
    bookingFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative font-sans">
      {/* Hero Section */}
  <section id="home" className="relative h-[60vh] min-h-[720px] overflow-hidden pt-16">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                style={{ 
                  transform: `translateY(${scrollY * 0.5}px)`, 
                  willChange: 'transform',
                  transition: 'transform 0.05s linear'
                }}
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'}`}
            ></button>
          ))}
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 text-center text-white animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">{heroSlides[currentSlide].title}</h1>
            <p className="text-xl md:text-2xl mb-12 text-cyan-100">{heroSlides[currentSlide].subtitle}</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => window.location.href = '/tours'}
                className="bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-500 text-white px-8 py-3 rounded-full text-lg font-medium transition transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
              >
                Explore Packages <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => window.location.href = '/contact'}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-medium transition transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
              >
                Connect With Us
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleSlideChange('prev')}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full z-30 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => handleSlideChange('next')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full z-30 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </section>

      {/* Popular Activities */}
      <section className="py-16 bg-gradient-to-b from-blue-950 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose MaldivesLuxe</h2>
            <p className="text-lg text-cyan-100 max-w-3xl mx-auto">
              We offer exclusive experiences tailored to create unforgettable memories in paradise
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="bg-white bg-opacity-10 rounded-xl p-6 text-center transform transition duration-300 backdrop-blur-sm hover:bg-opacity-20 hover:scale-105"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div className="h-16 w-16 rounded-full bg-cyan-400 bg-opacity-20 flex items-center justify-center mb-4 mx-auto">
                  <div className="text-cyan-300">
                    {activity.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {activity.name}
                </h3>
                <p className="text-cyan-50">
                  {activity.para}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section>
        <ImageGallery limit={6} />
      </section>

      {/* About Section with Animated Counters */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=800&auto=format&fit=crop" alt="About Maldives Paradise" className="w-full" />
              </div>
              <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 hidden md:block">
                <div className="bg-cyan-700 text-white p-6 rounded-lg shadow-xl">
                  <div className="text-3xl font-bold">10+</div>
                  <div className="text-sm">Years of Excellence</div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">About Maldives Paradise Travels</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Founded in 2013, Maldives Paradise Travels has become the premier tour operator specializing in luxury and adventure experiences throughout the Maldives archipelago. Our team of local experts crafts unforgettable journeys that showcase the best of this tropical paradise.
              </p>
              <p className="text-gray-600 mb-8 text-lg">
                We take pride in our commitment to sustainable tourism practices and supporting local communities while providing our guests with exceptional service and unforgettable experiences.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {statsData.map((stat, index) => (
                  <Counter 
                    key={index} 
                    end={stat.value} 
                    duration={2000 + (index * 200)} 
                    label={stat.label} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Experience />

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-gradient-to-r from-blue-900 to-cyan-900 text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Guests Say</h2>
            <p className="text-cyan-100 text-lg max-w-3xl mx-auto">
              Don't just take our word for it – hear from our happy travelers who have experienced the magic of the Maldives with us
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map(testimonial => (
              <div key={testimonial.id} className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < testimonial.rating ? "text-yellow-400" : "text-gray-400"} />
                  ))}
                </div>
                <p className="text-lg italic mb-6">{testimonial.text}</p>
                <div className="flex items-center">
                  <img src={testimonial.image} alt={testimonial.author} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <div className="font-bold">{testimonial.author}</div>
                    <div className="text-sm text-cyan-200">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Trail Tales & Travel Feels</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get inspired by the latest snapshots from paradise
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {instagramImages.map((image, i) => (
              <div key={i} className="relative group overflow-hidden rounded-lg shadow-md">
                <img
                  src={image}
                  alt="Instagram photo"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <Image size={24} className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-blue-900 to-blue-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Maldives aerial view"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready for Your Dream Vacation?</h2>
            <p className="text-cyan-100 text-lg mb-8">
              Let us help you plan the perfect getaway to the Maldives. 
              Our travel experts will create a customized experience based on your preferences.
            </p>
            <button 
              onClick={() => window.location.href = '/tours'}
              className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-cyan-500 transition-colors shadow-md text-lg font-medium"
            >
              Explore Packages
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
