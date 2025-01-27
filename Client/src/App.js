import React from 'react';
import Navigation from './components/Navigation';
import { Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import Tours from './screens/Tours';
import Contact from './screens/Contact';
import AdminPanel from './screens/AdminPanel';
import TourDetails from './screens/TourDetails';
import ImageGallery from './components/Home/ImageGallery';


const App = () => {
  return (
    <div>
      <Navigation />
      <Routes> 
        <Route path='/' element={<HomeScreen />} />
        <Route path='/tours' element={<Tours />} /> 
        <Route path='/contact' element={<Contact />} /> 
        <Route path='/admin' element={<AdminPanel />} /> 
        <Route path='/tours/:id' element={<TourDetails/>}/>
        <Route path="/" element={<ImageGallery />} />
      </Routes>
    </div>
  );
};

export default App;
