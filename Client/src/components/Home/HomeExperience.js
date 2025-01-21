import React from 'react';
import './HomeExperience.css';

const experiences = [
  {
    title: 'Overwater Bungalow Stay',
    description: 'Waking up to panoramic ocean views, stepping directly into the sea from your private deck, and soaking in infinity pools.',
    imageUrl: 'https://i.postimg.cc/50Fkmt7h/Home-Tab-1.png',
  },
  {
    title: 'Exclusive Dining Experiences',
    description:
      'Savor gourmet meals in breathtaking locations – from private beaches to secluded spots in the heart of the island’s lush paradise.',
    imageUrl:
      'https://i.postimg.cc/c1MkzY62/Anantara20-Maldives20ishan-seefromthesky-gtt803-Wswn-A-unsplash.webp',
  },
  {
    title: 'Luxury Island Excursions',
    description:
      'Embark on unforgettable journeys aboard a traditional dhoni or a luxury yacht, exploring the pristine beauty of the Maldives.',
    imageUrl:
      'https://i.postimg.cc/63PXn7g5/606e8ca07ac5d175-1-1wt4mcwxvxeqzscqkzr6sq.jpg',
  },
  {
    title: 'Premium Diving Adventures',
    description:
      'Immerse yourself in a spectacular underwater world with vibrant coral reefs and an abundance of marine life.',
    imageUrl: 'https://i.postimg.cc/rw7xng4S/diving-689831-1280.jpg',
  },
]

const HomeExperience = () => {
  return (
    <div className="experience-container">
      {experiences.map((experience, index) => (
        <div className={`experience-block block-${index}`} key={index}>
          <div
            className="experience-image"
            style={{ backgroundImage: `url(${experience.imageUrl})` }}
          >
            <h2>{experience.title}</h2> 
            <div className="hover-overlay">
              <p>{experience.description}</p><br></br>
              <button className="discover-button">DISCOVER MORE</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeExperience;
