import { useState } from 'react';
import { Plus, Minus, MessageCircle } from 'lucide-react';

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "What's the best time to visit the Maldives?",
      answer: "The Maldives enjoys a tropical climate year-round with temperatures between 26-32°C (79-90°F). The best time to visit is during the dry season from November to April when you'll experience sunny days, little rain, and excellent visibility for diving and snorkeling. The monsoon season (May to October) brings occasional rain showers, but still plenty of sunshine and lower prices."
    },
    {
      question: "What activities can I experience in the Maldives?",
      answer: "The Maldives offers a wide range of activities: world-class snorkeling and diving among vibrant coral reefs, dolphin and whale shark excursions, sunset cruises, island hopping tours, water sports (jet skiing, parasailing, windsurfing), fishing trips, spa treatments, and authentic cultural experiences at local islands. Our packages can be customized to include any combination of these activities."
    },
    {
      question: "What types of accommodation do you offer?",
      answer: "We partner with a variety of accommodations ranging from luxurious overwater villas and beachfront bungalows to boutique hotels and guesthouses on local islands. Our selection includes 3-star to 5-star properties, private island resorts, and unique stay experiences. Each option is carefully vetted for quality, service, and value."
    },
    {
      question: "How do I get around the Maldives?",
      answer: "Inter-island transportation in the Maldives is primarily by speedboat, domestic flight, or seaplane. Airport transfers to your resort are typically included in our packages. For island hopping tours, we arrange all necessary transportation. Many resorts are on private islands where everything is within walking distance or accessible by buggy service."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 to-cyan-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
          </h2>
          <p className="text-lg text-cyan-100 max-w-2xl mx-auto">
            Everything you need to know before experiencing paradise
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid gap-6">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white bg-opacity-5 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 
                ${openIndex === index ? 'shadow-lg shadow-cyan-500/10' : ''}`}
            >
              <button
                className="flex justify-between items-center w-full text-left p-6 focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <h3 className="text-xl font-medium text-white">
                  {faq.question}
                </h3>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300
                  ${openIndex === index ? 'bg-cyan-400 text-blue-900' : 'bg-blue-800 text-cyan-300'}`}>
                  {openIndex === index ? (
                    <Minus className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </div>
              </button>
              
              <div 
                className={`transition-all duration-500 ease-in-out px-6 overflow-hidden
                  ${openIndex === index ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
              >
                <div className="border-t border-cyan-800/30 pt-4 mt-2 bg-blue-700/30 p-4 rounded-lg border-2 border-white">
                  <p className="text-cyan-50 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      
      </div>
    </section>
  );
};

export default FaqAccordion;
