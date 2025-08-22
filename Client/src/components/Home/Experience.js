import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Experience = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  const experiences = [
 {
      id: 1,
      title: "Underwater Dining",
      description: "Experience a magical dinner surrounded by vibrant marine life in an underwater restaurant.",
      image: "https://i.postimg.cc/c1MkzY62/Anantara20Maldives20ishan-seefromthesky-gtt803WswnA-unsplash.webp",
    },
    {
      id: 2,
      title: "Dolphin Cruise",
      description: "Set sail at sunset to witness playful dolphins in their natural habitat.",
      image: "https://i.postimg.cc/7hs76b6B/beautiful-shot-cute-dolphins-hanging-out-underwater-bimini-bahamas.jpg",

    },
    {
      id: 3,
      title: "Island Hopping",
      description: "Explore multiple pristine islands and experience authentic Maldivian culture.",
      image: "https://i.postimg.cc/rpszBS8J/pexels-asadphoto-1450355.jpg",
   
    },
    {
      id: 4,
      title: "Sunset Fishing",
      description: "Traditional hand-line fishing followed by a beachside BBQ of your fresh catch.",
      image: "https://i.postimg.cc/tJQTnwFS/pexels-asadphoto-3250613.jpg",
 
    },
    {
      id: 5,
      title: "Seaplane Photo Flight",
      description: "Capture breathtaking aerial views of the atolls and turquoise lagoons.",
      image: "https://i.postimg.cc/76pCMfrN/pexels-asadphoto-2245290.jpg",
 
    },
    {
      id: 6,
      title: "Coral Planting",
      description: "Contribute to marine conservation by planting coral fragments with marine biologists.",
      image: "https://i.postimg.cc/BQ7FYFwc/11.png",
     
    },
    {
      id: 7,
      title: "Luxury Spa Treatment",
      description: "Indulge in rejuvenating treatments in an overwater spa pavilion.",
      image: "https://i.postimg.cc/DZJDVxpn/massage-599532_1280.jpg",
   
    },
    {
      id: 8,
      title: "Bioluminescent Beach Night Tour",
      description: "Witness the magical phenomenon of glowing plankton under the stars.",
      image: "https://i.postimg.cc/nz1R6SSg/5.png",
  
    }
  ];

  const cardsToShow = 4;
  const maxIndex = experiences.length - cardsToShow;

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, maxIndex]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? maxIndex : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Unforgettable Experiences</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover extraordinary activities that will make your Maldives journey truly magical
          </p>
        </div>
        
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out w-full"
              style={{
                transform: `translateX(-${currentIndex * 25}%)`,
              }}
            >
              {experiences.map((experience) => (
                <div 
                  key={experience.id} 
                  className="w-full md:w-1/4 flex-shrink-0 px-2"
                >
                  <div className="bg-white rounded-xl overflow-hidden h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={experience.image} 
                        alt={experience.title} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-blue-900 mb-2">{experience.title}</h3>
                      <p className="text-gray-600">{experience.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white text-blue-600 hover:text-blue-800 p-3 rounded-full shadow-lg z-10 opacity-90 hover:opacity-100 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white text-blue-600 hover:text-blue-800 p-3 rounded-full shadow-lg z-10 opacity-90 hover:opacity-100 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
          
        </div>
      </div>
    </section>
  );
};

export default Experience;
