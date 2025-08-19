import { useState } from 'react';
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiMessageSquare,
  FiPieChart,
  FiBell,
  FiSearch,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiAlertCircle
} from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

// Updated imports (make sure your file names match these)
import ManageProperties from './ManageProperties';
import ManageRentals from '../managerentals';
import Payments from './admin payments';
import AdminMessages from './admin messages';
import Reports from './admin reports';
import Settings from '../Settings';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Example metrics for admin dashboard
  const dashboardStats = [
    { title: 'Total Properties', value: 25, change: '+4%', isPositive: true },
    { title: 'Active Rentals', value: 40, change: '+2%', isPositive: true },
    { title: 'Overdue Payments', value: 5, change: '+1', isPositive: false },
    { title: 'Total Revenue', value: 'KSh 1,240,000', change: '+10%', isPositive: true },
  ];

  const navItems = [
    { id: 'dashboard', icon: <FiHome className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'properties', icon: <FaBuilding className="w-5 h-5" />, label: 'Manage Properties' },
    { id: 'rentals', icon: <FiUsers className="w-5 h-5" />, label: 'Manage Rentals' },
    { id: 'payments', icon: <FiDollarSign className="w-5 h-5" />, label: 'Payments' },
    { id: 'messages', icon: <FiMessageSquare className="w-5 h-5" />, label: 'Messages' },
    { id: 'reports', icon: <FiPieChart className="w-5 h-5" />, label: 'Reports' },
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
            <FaBuilding className="text-white text-3xl" />
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

              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <FiBell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

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
          {activeTab === 'dashboard' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardStats.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <span className={`ml-2 text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Example recent section */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">System Alerts</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                      <FiAlertCircle className="w-5 h-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Overdue Payment</h4>
                        <span className="text-xs text-gray-500">10 min ago</span>
                      </div>
                      <p className="text-sm text-gray-600">Tenant John Doe - KSh 15,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'dashboard' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-center">
              {activeTab === 'properties' && <ManageProperties />}
              {activeTab === 'rentals' && <ManageRentals />}
              {activeTab === 'payments' && <Payments />}
              {activeTab === 'messages' && <AdminMessages />}
              {activeTab === 'reports' && <Reports />}
              {activeTab === 'settings' && <Settings />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
