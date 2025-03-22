import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Card, Divider, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
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

// Conversion function: If the record currency is not USD, convert the price using exchangeRates from the API.
// Assumes exchangeRates is relative to USD (e.g. { EUR: 0.85 } means 1 USD = 0.85 EUR).
const convertToUSD = (price, currency, rates) => {
  if (currency === 'USD') return price;
  const rate = rates[currency];
  if (!rate) return price; // Fallback if rate not available
  // If rate is the amount of currency per 1 USD, then to convert price in that currency to USD:
  return price / rate;
};

const TourInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [subject, setSubject] = useState('');

  const { isMobile, isTablet } = useDeviceType();
  const isDesktop = !isMobile && !isTablet;

  const [exchangeRates, setExchangeRates] = useState({});

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      setExchangeRates(response.data.rates);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  useEffect(() => {
    fetchInquiries();
    fetchExchangeRates();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/inquiries');
      if (!response.ok) throw new Error('Failed to fetch inquiries.');
      const data = await response.json();

      const transformed = data.map((item) => ({
        ...item,
        _id: item._id?.$oid || item._id,
        travel_date: item.travel_date ? new Date(item.travel_date) : null,
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setInquiries(transformed);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      message.error(error.message || 'Failed to fetch inquiries.');
    } finally {
      setLoading(false);
    }
  };

  const deleteInquiry = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this inquiry?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/inquiries/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete inquiry.');
      message.success('Inquiry deleted successfully.');
      fetchInquiries();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      message.error(error.message || 'Failed to delete inquiry.');
    }
  };

  const handleSendReply = async () => {
    if (!currentInquiry || !replyMessage) {
      message.error('Reply message cannot be empty.');
      return;
    }

    try {
      const response = await fetch('/inquiries/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: currentInquiry._id,
          email: currentInquiry.email,
          subject: subject || `Reply to: ${currentInquiry.name}`,
          replyMessage,
        }),
      });
      if (!response.ok) throw new Error('Failed to send reply.');
      message.success('Reply sent successfully.');
      setReplyModalVisible(false);
      setReplyMessage('');
      setSubject('');
      fetchInquiries();
    } catch (error) {
      console.error('Error sending reply:', error);
      message.error(error.message || 'Failed to send reply.');
    }
  };

  const handleViewReply = (record) => {
    if (!record.reply) {
      message.info('No reply has been sent for this inquiry.');
      return;
    }
    const sentAt = record.reply.sentAt ? new Date(record.reply.sentAt) : null;
    const formattedDate = sentAt && !isNaN(sentAt) ? sentAt.toLocaleString() : 'Invalid Date';

    Modal.info({
      title: `Reply to ${record.name}`,
      content: (
        <div>
          <p><strong>Subject:</strong> {record.reply.subject}</p>
          <p><strong>Message:</strong> {record.reply.message}</p>
          <p><strong>Sent On:</strong> {formattedDate}</p>
        </div>
      ),
    });
  };

  // Only keep a few columns in the top-level row
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => {
        const replyButtonStyle = !record.reply
          ? { backgroundColor: 'blue', color: '#fff' }
          : {};
        const viewReplyButtonStyle = record.reply
          ? { backgroundColor: 'blue', color: '#fff' }
          : {};

        return (
          <Space>
            <Button
              type="primary"
              style={replyButtonStyle}
              onClick={() => {
                setCurrentInquiry(record);
                setReplyModalVisible(true);
              }}
            >
              Reply
            </Button>
            <Button
              type="primary"
              style={viewReplyButtonStyle}
              onClick={() => handleViewReply(record)}
            >
              View Reply
            </Button>
            <Button
              icon={<DeleteOutlined />}
              style={{ border: '1px solid red', color: 'red' }}
              onClick={() => deleteInquiry(record._id)}
            />
          </Space>
        );
      },
    },
  ];

  // Provide a row expansion with all the other details and show final price converted to USD when needed.
  const expandedRowRender = (record) => {
    const formattedDate = record.travel_date
      ? record.travel_date.toLocaleDateString()
      : 'N/A';
    const finalPriceInUSD =
      record.final_price && record.currency !== 'USD'
        ? convertToUSD(record.final_price, record.currency, exchangeRates)
        : record.final_price;
    return (
      <div style={{ backgroundColor: '#fafafa', padding: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <p><strong>Phone Number:</strong> {record.phone_number || 'N/A'}</p>
            <p><strong>Travel Date:</strong> {formattedDate}</p>
            <p><strong>Traveller Count:</strong> {record.traveller_count || 'N/A'}</p>
            <p><strong>Message:</strong> {record.message || 'N/A'}</p>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <p><strong>Tour:</strong> {record.tour || 'N/A'}</p>
            <p><strong>Selected Nights:</strong> {record.selected_nights_key || 'N/A'} Nights</p>
            <p><strong>Option:</strong> {record.selected_nights_option || 'N/A'}</p>
            <p><strong>Food:</strong> {record.selected_food_category || 'N/A'}</p>
            <p>
              <strong>Final Price:</strong> USD{' '}
              {finalPriceInUSD !== undefined
                ? finalPriceInUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '0'}
            </p>
          </Col>
        </Row>
      </div>
    );
  };

  // For mobile/tablet, we can still show card layout
  const renderMobileCards = () => {
    return (
      <>
        {inquiries.map((inquiry) => {
          const replyButtonStyle = !inquiry.reply
            ? { backgroundColor: 'blue', color: '#fff' }
            : {};
          const viewReplyButtonStyle = inquiry.reply
            ? { backgroundColor: 'blue', color: '#fff' }
            : {};

          const formattedTravelDate = inquiry.travel_date
            ? inquiry.travel_date.toLocaleDateString()
            : 'N/A';

          const finalPriceInUSD =
            inquiry.final_price && inquiry.currency !== 'USD'
              ? convertToUSD(inquiry.final_price, inquiry.currency, exchangeRates)
              : inquiry.final_price;

          return (
            <Card
              key={inquiry._id}
              style={{ marginBottom: 16, backgroundColor: '#f0f0f0', paddingTop: 8 }}
              bodyStyle={{ padding: '0 24px 24px 24px' }}
              title={(
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong>Name:</strong> {inquiry.name}
                  <strong>Email:</strong> {inquiry.email}
                </div>
              )}
            >
              <Divider style={{ margin: '12px 0' }} />
              <p><strong>Phone:</strong> {inquiry.phone_number || 'N/A'}</p>
              <p><strong>Travel Date:</strong> {formattedTravelDate}</p>
              <p><strong>Traveller Count:</strong> {inquiry.traveller_count || 'N/A'}</p>
              <p><strong>Message:</strong> {inquiry.message}</p>
              <Divider />
              <p><strong>Tour:</strong> {inquiry.tour || 'N/A'}</p>
              <p><strong>Nights:</strong> {inquiry.selected_nights_key || 'N/A'}</p>
              <p><strong>Option:</strong> {inquiry.selected_nights_option || 'N/A'}</p>
              <p><strong>Food:</strong> {inquiry.selected_food_category || 'N/A'}</p>
              <p>
                <strong>Final Price:</strong> USD{' '}
                {finalPriceInUSD !== undefined
                  ? finalPriceInUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : '0'}
              </p>
              <Divider />
              <Space style={{ padding: '0 15%' }}>
                <Button
                  type="primary"
                  style={replyButtonStyle}
                  onClick={() => {
                    setCurrentInquiry(inquiry);
                    setReplyModalVisible(true);
                  }}
                >
                  Reply
                </Button>
                <Button
                  type="primary"
                  style={viewReplyButtonStyle}
                  onClick={() => handleViewReply(inquiry)}
                >
                  View Reply
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  style={{ border: '1px solid red', color: 'red' }}
                  onClick={() => deleteInquiry(inquiry._id)}
                />
              </Space>
            </Card>
          );
        })}
      </>
    );
  };

  return (
    <div>
      <h2 className="text-5xl font-bold text-center mb-8">Tour Inquiries</h2>
      <Button
        type="primary"
        onClick={fetchInquiries}
        disabled={loading}
        style={{ marginBottom: '20px' }}
      >
        {loading ? 'Reloading...' : 'Reload Inquiries'}
      </Button>

      {isDesktop ? (
        <Table
          dataSource={inquiries}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 6 }}
          expandable={{
            expandedRowRender: (record) => expandedRowRender(record),
            rowExpandable: (record) => true,
          }}
        />
      ) : (
        renderMobileCards()
      )}

      <Modal
        title={`Reply to ${currentInquiry?.name}`}
        visible={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        onOk={handleSendReply}
        okText="Send Reply"
      >
        <Form layout="vertical">
          <Form.Item label="Subject">
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject of the reply"
            />
          </Form.Item>
          <Form.Item label="Reply Message">
            <Input.TextArea
              rows={4}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TourInquiries;