import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import AllTours from '../components/AllTours';
import AddTour from '../components/AddTour';
import ContactInquiries from '../components/ContactInquiries';
import TourInquiries from '../components/TourInquiries';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function useDeviceType() {
  const [deviceType, setDeviceType] = useState({
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceType({
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

const { TabPane } = Tabs;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('1');
  const navigate = useNavigate();
  const { isMobile, isTablet } = useDeviceType();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/users/check-auth', { withCredentials: true });
        if (!response.data.isAuthenticated || !response.data.isAdmin) {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="min-h-screen bg-slate-300 pt-24">
      <div className="flex justify-center items-center w-full font-sans">
        <div className={`max-w-7xl w-full mx-4 my-8 bg-[#1e3a8a] rounded-xl shadow-2xl overflow-hidden ${isMobile ? 'mx-2' : 'mx-6'}`}>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            className="w-full"
            renderTabBar={(props, DefaultTabBar) => (
              <div className="flex justify-center">
                <DefaultTabBar {...props} className="flex w-full max-w-3xl justify-between" />
              </div>
            )}
            tabBarStyle={{
              background: '#1e3a8a',
              padding: '0 1rem',
              borderBottom: '2px solid #3b82f6',
            }}
          >
            <TabPane
              tab={
                <span className="text-white text-lg md:text-xl font-semibold px-4 py-2">
                  Tours
                </span>
              }
              key="1"
            >
              <div className="p-6 bg-white">
                <AllTours />
              </div>
            </TabPane>
            <TabPane
              tab={
                <span className="text-white text-lg md:text-xl font-semibold px-4 py-2">
                  Add Tour
                </span>
              }
              key="2"
            >
              <div className="p-6 bg-white">
                <AddTour />
              </div>
            </TabPane>
            <TabPane
              tab={
                <span className="text-white text-lg md:text-xl font-semibold px-4 py-2">
                  Contact Inquiries
                </span>
              }
              key="3"
            >
              <div className="p-6 bg-white">
                <ContactInquiries />
              </div>
            </TabPane>
            <TabPane
              tab={
                <span className="text-white text-lg md:text-xl font-semibold px-4 py-2">
                  Tour Inquiries
                </span>
              }
              key="4"
            >
              <div className="p-6 bg-white">
                <TourInquiries />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
