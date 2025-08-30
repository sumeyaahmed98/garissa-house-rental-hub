import { useState } from 'react';
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiTrendingUp,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiSearch,
} from 'react-icons/fi';
import { FaHome } from 'react-icons/fa';

// Updated imports (make sure your file names match these)
import ManageProperties from './ManageProperties';

import EnhancedAdminReports from './EnhancedAdminReports';
import Settings from '../Settings';
import ManageUsers from './ManageUsers';
import AdminManageRentals from './AdminManageRentals';
import AdminDashboardOverview from './AdminDashboardOverview';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: <FiHome className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'users', icon: <FiUsers className="w-5 h-5" />, label: 'Users' },
    { id: 'properties', icon: <FaHome className="w-5 h-5" />, label: 'Manage Properties' },
    { id: 'rentals', icon: <FiUsers className="w-5 h-5" />, label: 'Manage Rentals' },
    { id: 'reports', icon: <FiTrendingUp className="w-5 h-5" />, label: 'Reports' },
    { id: 'settings', icon: <FiSettings className="w-5 h-5" />, label: 'Settings' },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Mobile Menu Button */}
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
          {/* Logo */}
          <div className="flex items-center justify-center py-6 px-4 bg-blue-600">
            <FaHome className="text-white text-3xl" />
            {sidebarOpen && (
              <span className="ml-2 text-white text-xl font-bold">AdminPanel</span>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center p-4 border-b">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">AD</span>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <h3 className="text-sm font-semibold">Admin User</h3>
                <p className="text-xs text-gray-500">Administrator</p>
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
                    <span>{item.icon}</span>
                    {sidebarOpen && <span className="ml-3">{item.label}</span>}
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
              <div className="relative hidden md:block">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>



              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">AD</span>
                </div>
                <span className="hidden md:inline">Admin</span>
                <FiChevronDown className="hidden md:block w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && <AdminDashboardOverview />}
          {activeTab === 'users' && <ManageUsers />}
          {activeTab === 'properties' && <ManageProperties />}
          {activeTab === 'rentals' && <AdminManageRentals />}
          {activeTab === 'reports' && <EnhancedAdminReports />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
