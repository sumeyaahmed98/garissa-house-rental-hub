import React, { useState, useEffect } from 'react';
import {
  FiHome,
  FiSearch,
  FiHeart,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiChevronLeft,
  FiLayout,
  FiList,
  FiMessageSquare
} from 'react-icons/fi';
import { FaHome } from 'react-icons/fa';
import PropertyCard from '../components/PropertyCard';
import PropertySearch from '../components/PropertySearch';
import PropertyDetail from '../components/PropertyDetail';
import TenantDashboardOverview from './TenantDashboardOverview';
import CommunicationSystem from '../components/CommunicationSystem';
import ContactForm from '../components/ContactForm';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const TenantDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({});
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [selectedPropertyForContact, setSelectedPropertyForContact] = useState(null);

  const navItems = [
    { id: 'dashboard', icon: <FiHome className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'browse', icon: <FiHome className="w-5 h-5" />, label: 'Browse Properties' },
    { id: 'favorites', icon: <FiHeart className="w-5 h-5" />, label: 'My Favorites' },
    { id: 'search', icon: <FiSearch className="w-5 h-5" />, label: 'Advanced Search' },
    { id: 'communication', icon: <FiMessageSquare className="w-5 h-5" />, label: 'Communication' },
    { id: 'profile', icon: <FiUser className="w-5 h-5" />, label: 'Profile' },
    { id: 'settings', icon: <FiSettings className="w-5 h-5" />, label: 'Settings' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Fetch properties
  const fetchProperties = async (searchFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== '' && value !== false && value !== null) {
          params.append(key, value);
        }
      });

      const response = await api.get(`/properties?${params.toString()}`);
      setProperties(response.data.properties);
    } catch (error) {
      toast.error('Failed to fetch properties');
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data.properties);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Handle search
  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    fetchProperties(searchFilters);
  };

  // Handle filters change
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (propertyId, isFavorite) => {
    if (isFavorite) {
      setFavorites(prev => [...prev, properties.find(p => p.id === propertyId)]);
    } else {
      setFavorites(prev => prev.filter(p => p.id !== propertyId));
    }
  };

  // Handle property detail view
  const handleViewDetails = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  // Handle close property detail
  const handleCloseDetail = () => {
    setSelectedPropertyId(null);
  };

  // Handle contact owner
  const handleContactOwner = (property) => {
    setSelectedPropertyForContact(property);
  };

  // Handle close contact form
  const handleCloseContactForm = () => {
    setSelectedPropertyForContact(null);
  };

  // Load initial data
  useEffect(() => {
    fetchProperties();
    fetchFavorites();
  }, []);

  const renderProperties = (propertyList, showFavoriteButton = true) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (propertyList.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or check back later for new listings.</p>
        </div>
      );
    }

    return (
      <div className={`grid gap-6 ${viewMode === 'grid'
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        : 'grid-cols-1'
        }`}>
        {propertyList.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onFavoriteToggle={handleFavoriteToggle}
            onViewDetails={handleViewDetails}
            onContactOwner={handleContactOwner}
            showFavoriteButton={showFavoriteButton}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
      >
        {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-xl transition-all duration-300 fixed h-full z-40 md:relative ${mobileMenuOpen ? 'block' : 'hidden'} md:block`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center py-6 px-4 bg-blue-600">
            <FaHome className="text-white text-3xl" />
            {sidebarOpen && (
              <span className="ml-2 text-white text-xl font-bold">RentalPro</span>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center p-4 border-b">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">T</span>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <h3 className="text-sm font-semibold">Tenant User</h3>
                <p className="text-xs text-gray-500">House Seeker</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul>
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center w-full px-4 py-3 ${activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'hover:bg-gray-100'}`}
                  >
                    <span className="flex items-center justify-center">
                      {item.icon}
                    </span>
                    {sidebarOpen && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={() => handleTabChange('logout')}
              className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded"
            >
              <FiLogOut className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="hidden md:block p-2 rounded-md hover:bg-gray-100"
              >
                {sidebarOpen ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
              </button>
              <h1 className="text-xl font-semibold ml-2 capitalize">{activeTab.replace('-', ' ')}</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              {activeTab === 'browse' && (
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                  >
                    <FiLayout className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
              )}



              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">T</span>
                </div>
                <span className="hidden md:inline">Tenant</span>
                <FiChevronDown className="hidden md:block w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'browse' && (
            <div>
              <PropertySearch
                onSearch={handleSearch}
                onFiltersChange={handleFiltersChange}
                filters={filters}
              />
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Available Properties ({properties.length})
                </h2>
              </div>
              {renderProperties(properties)}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">My Favorites</h2>
                <p className="text-gray-600">Properties you've saved for later</p>
              </div>
              {renderProperties(favorites, false)}
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Advanced Search</h2>
                <p className="text-gray-600">Find your perfect home with detailed filters</p>
              </div>
              <PropertySearch
                onSearch={handleSearch}
                onFiltersChange={handleFiltersChange}
                filters={filters}
              />
              {renderProperties(properties)}
            </div>
          )}

          {activeTab === 'communication' && <CommunicationSystem />}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Profile</h2>

                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-2xl font-semibold">T</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Tenant User</h3>
                      <p className="text-gray-500">House Seeker</p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          defaultValue="Tenant User"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          defaultValue="tenant@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          defaultValue="+254700000000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          defaultValue="Garissa, Kenya"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rental History */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Rental History</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium">Beautiful 3-Bedroom House</p>
                          <p className="text-sm text-gray-500">Garissa, Kenya</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">KSh 25,000/month</p>
                          <p className="text-sm text-gray-500">2023 - 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h2>

                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Property Alerts</p>
                          <p className="text-sm text-gray-500">Get notified when new properties match your criteria</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Price Drop Alerts</p>
                          <p className="text-sm text-gray-500">Get notified when property prices change</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive important updates via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h4>
                    <div className="space-y-3">
                      <button className="w-full text-left px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        Delete Account
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors">
                        Export My Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && <TenantDashboardOverview />}
        </main>
      </div>

      {/* Property Detail Modal */}
      {selectedPropertyId && (
        <PropertyDetail
          propertyId={selectedPropertyId}
          onClose={handleCloseDetail}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}

      {/* Contact Form Modal */}
      {selectedPropertyForContact && (
        <ContactForm
          property={selectedPropertyForContact}
          onClose={handleCloseContactForm}
          onSuccess={() => {
            handleCloseContactForm();
            toast.success('Contact request sent successfully!');
          }}
        />
      )}
    </div>
  );
};

export default TenantDashboard;
