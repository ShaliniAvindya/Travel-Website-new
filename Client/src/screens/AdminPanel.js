import React, { useState } from 'react';
import { Tabs } from 'antd';
import AllTours from '../components/AllTours';
import AddTour from '../components/AddTour';
import ContactInquiries from '../components/ContactInquiries';
import Footer from '../components/Footer';

const { TabPane } = Tabs;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('1');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        background: 'linear-gradient(to bottom, #f0f2f5, #dfe7ec)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          marginTop:'50px',
          marginBottom:'50px',
          maxWidth: '80vw',
          background: '#fff',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          tabBarStyle={{
            background: '#e8f0fc',
            fontWeight: 'bold',
            fontSize: '20px',
            padding: '0 10vw',
            height: '10vh',
            margin: '0',

          }}
          style={{
            width: '100%',
          }}
        >
          <TabPane tab="Tours" key="1">
            <div style={{ padding: '50px' }}>
              <AllTours />
            </div>
          </TabPane>
          <TabPane tab="Add Tour" key="2">
            <div style={{ padding: '50px' }}>
              <AddTour />
            </div>
          </TabPane>
          <TabPane tab="Contact Form Inquiries" key="3">
            <div style={{ padding: '50px' }}>
              <ContactInquiries />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
      <Footer />
    </div>
    
  );
};

export default AdminPanel;
