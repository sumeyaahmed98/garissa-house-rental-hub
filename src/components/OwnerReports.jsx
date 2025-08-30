import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiHome, FiUsers, FiDollarSign, FiCalendar, FiEye } from 'react-icons/fi';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import AdvancedCharts from './AdvancedCharts';

const OwnerReports = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeRentals: 0,
    totalRevenue: 0,
    contactRequests: 0,
    pendingRequests: 0
  });
  const [properties, setProperties] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch owner's properties
      const propertiesResponse = await api.get('/my-properties');
      const propertiesData = propertiesResponse.data.properties || [];
      setProperties(propertiesData);

      // Fetch owner's rentals
      const rentalsResponse = await api.get('/rentals');
      const rentalsData = rentalsResponse.data.rentals || [];
      setRentals(rentalsData);

      // Fetch contact requests
      const contactResponse = await api.get('/contact-requests');
      const contactData = contactResponse.data.contact_requests || [];
      setContactRequests(contactData);

      // Calculate stats
      const activeRentals = rentalsData.filter(rental => rental.status === 'active').length;
      const totalRevenue = rentalsData.reduce((sum, rental) => sum + (rental.rent_amount || 0), 0);
      const pendingRequests = contactData.filter(req => req.status === 'pending').length;

      setStats({
        totalProperties: propertiesData.length,
        activeRentals,
        totalRevenue,
        contactRequests: contactData.length,
        pendingRequests
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const getRevenueData = () => {
    const monthlyData = {};
    rentals.forEach(rental => {
      if (rental.status === 'active') {
        const date = new Date(rental.start_date);
        const month = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + (rental.rent_amount || 0);
      }
    });

    return {
      labels: Object.keys(monthlyData),
      datasets: [{
        label: 'Monthly Revenue (KSh)',
        data: Object.values(monthlyData),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    };
  };

  const getPropertyTypeData = () => {
    const typeCount = {};
    properties.forEach(property => {
      const type = property.property_type || 'Other';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return {
      labels: Object.keys(typeCount),
      datasets: [{
        data: Object.values(typeCount),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4'
        ]
      }]
    };
  };

  const getContactRequestsData = () => {
    const statusCount = {
      pending: 0,
      responded: 0,
      closed: 0
    };

    contactRequests.forEach(request => {
      statusCount[request.status] = (statusCount[request.status] || 0) + 1;
    });

    return {
      labels: ['Pending', 'Responded', 'Closed'],
      datasets: [{
        data: [statusCount.pending, statusCount.responded, statusCount.closed],
        backgroundColor: ['#F59E0B', '#10B981', '#6B7280']
      }]
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Analytics & Reports</h2>
        <p className="text-gray-600">Your property performance and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiHome className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProperties}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Rentals</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeRentals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiEye className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Contact Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.contactRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiCalendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <AdvancedCharts
            type="line"
            data={getRevenueData()}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return formatCurrency(value);
                    }
                  }
                }
              }
            }}
          />
        </div>

        {/* Property Types Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Types</h3>
          <AdvancedCharts
            type="doughnut"
            data={getPropertyTypeData()}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                title: {
                  display: false,
                },
              },
            }}
          />
        </div>

        {/* Contact Requests Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Requests Status</h3>
          <AdvancedCharts
            type="doughnut"
            data={getContactRequestsData()}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                title: {
                  display: false,
                },
              },
            }}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {contactRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{request.tenant_name}</p>
                  <p className="text-xs text-gray-500">{request.property_title}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'responded' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {request.status}
                </span>
              </div>
            ))}
            {contactRequests.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerReports;
