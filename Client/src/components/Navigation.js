import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { animated, useSpring } from 'react-spring';
import Slider from "react-slick";  
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AnimatedText = ({ children }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  const props = useSpring({
    opacity: visible ? 1 : 0,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(1.5)' }
  });

  return <animated.div style={props}>{children}</animated.div>;
};

// Image Slider for Home Tab
const HomeTabContent = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 3000, 
  };
  

  return (
    <div style={{ position: 'relative', minHeight: '98vh', opacity: '0.9' }}>
      <Slider {...settings}>
        <div>
          <img src="https://i.postimg.cc/8CYsNjcV/pexels-asadphoto-3426880.jpg" alt="ocean" style={{ width: '100%', height: '100vh' }} />
        </div>
        <div>
          <img src="https://i.postimg.cc/yY3gdh9r/maldives-2299563-1280.jpg" alt="sea boat" style={{ width: '100%', height: '100vh' }} />
        </div>
        <div>
          <img src="https://i.postimg.cc/3RXf6xpz/Untitled-design-1.jpg" alt="events" style={{ width: '100%', height: '100vh' }} />
        </div>
        <div>
          <img src="https://i.postimg.cc/3w8xg24h/pexels-asadphoto-3601440.jpg" alt="ocean view" style={{ width: '100%', height: '100vh' }} />
        </div>
        <div>
          <img src="https://i.postimg.cc/NfqxcS6C/ray-954355-1280.jpg" alt="diving" style={{ width: '100%', height: '100vh' }} />
        </div>
        <div>
          <img src="https://i.postimg.cc/2jhtt2mg/Untitled-design.jpg" alt="Luxury hotel" style={{ width: '100%', height: '100vh' }} />
        </div>
      </Slider>

      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)' }}>
        <AnimatedText>
          <Typography variant="h1" component="div" style={{ textAlign: 'center', textShadow: '1px 1px 0 white, -1px 1px 0 white, 1px -1px 0 white, -1px -1px 0 white' }} fontFamily={'Playfair Display'} color="black">
            Welcome To<br/>Holiday Life
          </Typography>
        </AnimatedText>
      </div>
    </div>
  );
};

// Tab Content Component to be used for Rooms, Facilities, Contact, Login, etc.
const TabContent = ({ title, backgroundImage }) => (
  <div
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      minHeight: '98vh',
      opacity: '0.9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'black',
    }}
  >
    <AnimatedText>
      <Typography variant="h1" component="div" style={{ textAlign: 'center' }} marginTop={11} fontFamily={'Playfair Display'}>
        {title}
      </Typography>
    </AnimatedText>
  </div>
);

export const RoomsTabContent = () => (
  <TabContent title="Our Rooms" backgroundImage="https://firebasestorage.googleapis.com/v0/b/hotel-booking-system-35f4a.appspot.com/o/Public%20Folder%2Froom3.png?alt=media&token=910b9e2a-54b5-436a-8c8c-1fba99b19a3d" />
);

export const FacilitiesTabContent = () => (
  <TabContent title="Facilities we offer" backgroundImage="https://firebasestorage.googleapis.com/v0/b/hotel-booking-system-35f4a.appspot.com/o/Public%20Folder%2FSwimming.png?alt=media&token=a8b2c994-cf8e-429c-b874-fd01b633a44e" />
);

export const ContactTabContent = () => (
  <TabContent title="Contact us" backgroundImage="https://i.postimg.cc/Wb5WNvG7/pexels-asadphoto-1483053.jpg" />
);

export const LoginTabContent = () => (
  <TabContent title="Login with us" backgroundImage="https://firebasestorage.googleapis.com/v0/b/hotel-booking-system-35f4a.appspot.com/o/Public%20Folder%2Flogin.jpg?alt=media&token=a810ff0a-6305-4be3-8a40-d0abbb0b8875" />
);

export const RegisterTabContent = () => (
  <TabContent title="Register with us" backgroundImage="https://firebasestorage.googleapis.com/v0/b/hotel-booking-system-35f4a.appspot.com/o/Public%20Folder%2Flogin.jpg?alt=media&token=a810ff0a-6305-4be3-8a40-d0abbb0b8875" />
);


export const AccountTabContent = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    setUser(currentUser);
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/hotel-booking-system-35f4a.appspot.com/o/Public%20Folder%2FSpa.png?alt=media&token=f0e89146-dbfe-4a98-9eae-a1243bfb8de3')`,
      backgroundSize: 'cover',
      height: '100vh', 
      opacity: 0.86  
    }}>
      <TabContent
        title={user ? (user.isAdmin ? "Admin Dashboard" : "My Account") : "My Account"}
      />
    </div>
  );
};

const Navigation = () => {
  const [navBackground, setNavBackground] = useState('transparent');
  const [value, setValue] = useState(0);
  const [user, setUser] = useState();
  const location = useLocation();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (location.pathname === '/rooms') {
      setValue(1);
    } else if (location.pathname === '/facilities') {
      setValue(2);
    } else if (location.pathname === '/contact') {
      setValue(3);
    } else if (location.pathname === '/login') {
      setValue(5);
    } else if (location.pathname === '/register') {
      setValue(6);
    } else if (location.pathname === '/account') {
      setValue(7);
    } else {
      setValue(0);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const navbarHeight = 80;

      if (scrollPosition > navbarHeight) {
        setNavBackground('#023e8a');
      } else {
        setNavBackground('transparent');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  return (
    <div>
      <AppBar position="fixed" style={{ backgroundColor: navBackground, boxShadow: 'none', height: '100px', font: 'Playfair Display' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-around', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="white"
              style={{ marginLeft: '0px', marginRight: '110px' }}
            >
              <Tab label="Home" component={Link} to="/" value={0} />
              <Tab label="Tours" component={Link} to="/" value={1} />
              <Tab label="Contact" component={Link} to="/contact" value={3} />
              {/* <Typography
                variant="h4"
                component="div"
                sx={{ color: 'white' }}
                marginRight={20}
                marginLeft={20}
                fontFamily={'Playfair Display'}
              >
                HOLIDAY LIFE
              </Typography> */}
              <div style={{ marginLeft: '100px', marginRight: '100px' }}>
                <img
                  src="https://i.postimg.cc/6Q1tcM0S/HL1.png" 
                  alt="Holiday Life Logo"
                  style={{ height: '72px', objectFit: 'contain' }}
                />
              </div>
              {!user && <Tab label="Login" component={Link} to="/login" value={5} />}
              {!user && <Tab label="Register" component={Link} to="/register" value={6} />}
              {user && !user.isAdmin && <Tab label="Account" component={Link} to="/account" value={7} />}
              {user && user.isAdmin && <Tab label="Admin Panel" component={Link} to="/admin" value={8} />}
              {user && <Tab label="Logout" onClick={handleLogout} value={9} />}
            </Tabs>
          </div>
        </Toolbar>
      </AppBar>

      <div style={{ position: 'relative', minHeight: '98vh' }}>
        {value === 0 && <HomeTabContent />}
        {value === 1 && <RoomsTabContent />}
        {value === 2 && <FacilitiesTabContent />}
        {value === 3 && <ContactTabContent />}
        {value === 5 && <LoginTabContent />}
        {value === 6 && <RegisterTabContent />}
        {value === 7 && <AccountTabContent />}
      </div>
    </div>
  );
};

export default Navigation;
