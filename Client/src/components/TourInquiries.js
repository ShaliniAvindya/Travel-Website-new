import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const ContactInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Fetch inquiries from the backend
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inquiries');
      if (!response.ok) throw new Error('Failed to fetch inquiries.');
      const data = await response.json();

      // Transform data if needed (e.g., for the ._id.$oid or .travel_date.$date).
      const transformed = data.map((item) => ({
        ...item,
        _id: item._id?.$oid || item._id,
        travel_date: item.travel_date ? new Date(item.travel_date) : null,
      }));

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
      const response = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete inquiry.');
      message.success('Inquiry deleted successfully.');
      fetchInquiries();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      message.error(error.message || 'Failed to delete inquiry.');
    }
  };

  // Send reply to an inquiry
  const handleSendReply = async () => {
    if (!currentInquiry || !replyMessage) {
      message.error('Reply message cannot be empty.');
      return;
    }

    try {
      const response = await fetch('/api/inquiries/reply', {
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

  // View reply details
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

  // Define table columns (no "Reply Status" column now)
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (phone) => phone || 'N/A',
    },
    {
      title: 'Travel Date',
      dataIndex: 'travel_date',
      key: 'travel_date',
      render: (date) => (date ? date.toLocaleDateString() : 'N/A'),
    },
    {
      title: 'Traveller Count',
      dataIndex: 'traveller_count',
      key: 'traveller_count',
      render: (count) => count || 'N/A',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        // If there's no reply, highlight the Reply button.
        const replyButtonStyle = !record.reply
          ? { backgroundColor: 'blue', color: '#fff' }
          : {};
        
        // If there's a reply, highlight the View Reply button.
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
            {/* Only icon, no text for delete */}
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

return (
    <div>
        <h2 className="text-5xl font-bold text-center mb-8">Contact Inquiries</h2>
        <Button
            type="primary"
            onClick={fetchInquiries}
            disabled={loading}
            style={{ marginBottom: '20px' }}
        >
            {loading ? 'Reloading...' : 'Reload Inquiries'}
        </Button>

        <Table
            dataSource={inquiries}
            columns={columns.map((col) => ({ ...col, align: 'center' }))}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 6 }}
        />

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

export default ContactInquiries;
