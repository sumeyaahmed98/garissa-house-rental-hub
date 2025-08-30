import { useState } from 'react';
import { FiUser, FiLock, FiDollarSign, FiBell, FiMail, FiSettings } from 'react-icons/fi';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+254 712 345 678',
    notifications: true,
    newsletter: false,
    twoFactor: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save the settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Settings Sidebar */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Settings</h2>
        </div>
        <nav className="p-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center w-full px-4 py-3 text-left rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FiUser className="w-5 h-5 mr-3" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center w-full px-4 py-3 text-left rounded-lg ${activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FiLock className="w-5 h-5 mr-3" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center w-full px-4 py-3 text-left rounded-lg ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FiBell className="w-5 h-5 mr-3" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center w-full px-4 py-3 text-left rounded-lg ${activeTab === 'billing' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
                            <FiDollarSign className="w-5 h-5 mr-3" />
            Billing
          </button>
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6">
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-6 flex items-center">
                  <FiUser className="mr-2" />
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-6 flex items-center">
                  <FiSettings className="mr-2" />
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      id="current-password"
                      name="currentPassword"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      id="new-password"
                      name="newPassword"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirmPassword"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="twoFactor"
                      name="twoFactor"
                      checked={formData.twoFactor}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="twoFactor" className="ml-2 block text-sm text-gray-700">
                      Enable Two-Factor Authentication
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Security
                </button>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'notifications' && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-6 flex items-center">
                  <FiBell className="mr-2" />
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="notifications" className="block text-sm font-medium text-gray-700">Email Notifications</label>
                      <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                    </div>
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="newsletter" className="block text-sm font-medium text-gray-700">Newsletter</label>
                      <p className="text-sm text-gray-500">Receive our monthly newsletter</p>
                    </div>
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="sms" className="block text-sm font-medium text-gray-700">SMS Alerts</label>
                      <p className="text-sm text-gray-500">Receive important alerts via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      id="sms"
                      name="sms"
                      checked={formData.sms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'billing' && (
          <div>
            <h3 className="text-lg font-medium mb-6 flex items-center">
                              <FiDollarSign className="mr-2" />
              Billing Information
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiInfo className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Premium Subscription</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Your current plan is the Premium Plan at KSh 5,000/month. Next billing date is July 15, 2023.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h4>
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-md mr-3">
                    <FiDollarSign className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">VISA ending in 4242</p>
                    <p className="text-xs text-gray-500">Expires 04/2025</p>
                  </div>
                </div>
                <button className="mt-4 text-sm text-blue-600 hover:text-blue-800">Update Payment Method</button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Billing History</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>June 15, 2023</span>
                    <span className="font-medium">KSh 5,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>May 15, 2023</span>
                    <span className="font-medium">KSh 5,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>April 15, 2023</span>
                    <span className="font-medium">KSh 5,000</span>
                  </div>
                </div>
                <button className="mt-4 text-sm text-blue-600 hover:text-blue-800">View All Invoices</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;