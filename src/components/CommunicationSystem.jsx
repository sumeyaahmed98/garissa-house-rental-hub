import { useState, useEffect } from 'react';
import { FiSend, FiMessageSquare, FiUser, FiMail, FiPhone, FiCalendar, FiHome } from 'react-icons/fi';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const CommunicationSystem = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [activeTab, setActiveTab] = useState('compose');
    const [formData, setFormData] = useState({
        recipient: '',
        subject: '',
        message: '',
        propertyId: '',
        inquiryType: 'general'
    });
    const [properties, setProperties] = useState([]);
    const [users, setUsers] = useState([]);

    const inquiryTypes = [
        'general',
        'property_inquiry',
        'rental_application',
        'maintenance_request',
        'payment_question',
        'other'
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch user's properties (if owner) or all properties (if tenant)
            const propertiesResponse = await api.get(user?.role === 'owner' ? '/my-properties' : '/properties');
            setProperties(propertiesResponse.data.properties || []);

            // Fetch users for recipient selection
            const usersResponse = await api.get('/users');
            setUsers(usersResponse.data.users || []);

            // Fetch existing messages
            const messagesResponse = await api.get('/messages');
            setMessages(messagesResponse.data.messages || []);

        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 403) {
                toast.error('Access denied. Please check your permissions.');
            } else if (error.response?.status === 404) {
                toast.error('Communication service not available.');
            } else {
                toast.error('Failed to load communication data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!formData.recipient || !formData.subject || !formData.message.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSending(true);
        try {
            const response = await api.post('/messages', {
                recipient_id: formData.recipient,
                subject: formData.subject,
                message: formData.message,
                property_id: formData.propertyId || null,
                inquiry_type: formData.inquiryType
            });

            if (response.data.message) {
                setMessages(prev => [response.data.message, ...prev]);
                setFormData({
                    recipient: '',
                    subject: '',
                    message: '',
                    propertyId: '',
                    inquiryType: 'general'
                });
                toast.success('Message sent successfully');
                setActiveTab('messages');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const getRecipientOptions = () => {
        if (user?.role === 'admin') {
            return users.filter(u => u.id !== user.id);
        } else if (user?.role === 'owner') {
            return users.filter(u => u.role === 'tenant');
        } else if (user?.role === 'tenant') {
            return users.filter(u => u.role === 'owner');
        }
        return [];
    };

    const getPropertyOptions = () => {
        if (user?.role === 'owner') {
            return properties;
        } else if (user?.role === 'tenant') {
            return properties.filter(p => p.status === 'available');
        }
        return [];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInquiryTypeLabel = (type) => {
        const labels = {
            general: 'General Inquiry',
            property_inquiry: 'Property Inquiry',
            rental_application: 'Rental Application',
            maintenance_request: 'Maintenance Request',
            payment_question: 'Payment Question',
            other: 'Other'
        };
        return labels[type] || type;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold flex items-center">
                            <FiMessageSquare className="mr-2" />
                            Communication
                        </h2>
                    </div>
                    <nav className="p-2">
                        <button
                            onClick={() => setActiveTab('compose')}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'compose' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                }`}
                        >
                            <FiSend className="mr-3" />
                            Compose Message
                        </button>
                        <button
                            onClick={() => setActiveTab('messages')}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'messages' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                }`}
                        >
                            <FiMessageSquare className="mr-3" />
                            Messages ({messages.length})
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    {/* Compose Message */}
                    {activeTab === 'compose' && (
                        <div>
                            <h3 className="text-lg font-medium mb-6">Compose New Message</h3>
                            <form onSubmit={handleSendMessage} className="space-y-6 max-w-2xl">
                                {/* Recipient */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiUser className="inline mr-1" />
                                        Recipient *
                                    </label>
                                    <select
                                        name="recipient"
                                        value={formData.recipient}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select recipient</option>
                                        {getRecipientOptions().map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiMail className="inline mr-1" />
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter message subject"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Property (if applicable) */}
                                {getPropertyOptions().length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FiHome className="inline mr-1" />
                                            Related Property (Optional)
                                        </label>
                                        <select
                                            name="propertyId"
                                            value={formData.propertyId}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select property (optional)</option>
                                            {getPropertyOptions().map(property => (
                                                <option key={property.id} value={property.id}>
                                                    {property.title} - {property.address}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Inquiry Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiCalendar className="inline mr-1" />
                                        Inquiry Type
                                    </label>
                                    <select
                                        name="inquiryType"
                                        value={formData.inquiryType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {inquiryTypes.map(type => (
                                            <option key={type} value={type}>
                                                {getInquiryTypeLabel(type)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FiMessageSquare className="inline mr-1" />
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        placeholder="Type your message here..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>

                                {/* Send Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {sending ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        ) : (
                                            <FiSend className="mr-2" />
                                        )}
                                        {sending ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Messages List */}
                    {activeTab === 'messages' && (
                        <div>
                            <h3 className="text-lg font-medium mb-6">Message History</h3>
                            {messages.length === 0 ? (
                                <div className="text-center py-12">
                                    <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No messages yet</p>
                                    <p className="text-sm text-gray-400">Start a conversation by composing a new message</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{message.subject}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        To: {message.recipient_name} • {getInquiryTypeLabel(message.inquiry_type)}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-400">{formatDate(message.created_at)}</span>
                                            </div>
                                            <p className="text-gray-700 text-sm line-clamp-2">{message.message}</p>
                                            {message.property_title && (
                                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                                    <FiHome className="mr-1" />
                                                    Related to: {message.property_title}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunicationSystem;
