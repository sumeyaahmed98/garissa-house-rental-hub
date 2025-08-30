import { useState, useEffect } from 'react';
import { FiHome, FiCalendar, FiDollarSign, FiEdit, FiTrash2, FiPlus, FiUser, FiPhone, FiMail } from 'react-icons/fi';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const AdminManageRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetchAllRentals();
    fetchAllProperties();
    fetchAllUsers();
  }, []);

  const fetchAllRentals = async () => {
    try {
      const response = await api.get('/admin/rentals');
      setRentals(response.data.rentals || []);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Access denied. Only administrators can view all rentals.');
      } else {
        toast.error('Failed to fetch rentals');
      }
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      const users = response.data.users || [];
      setTenants(users.filter(user => user.role === 'tenant'));
      setOwners(users.filter(user => user.role === 'owner'));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    terminated: 'bg-gray-100 text-gray-800'
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
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Admin Rental Management</h2>
        <div className="flex space-x-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{tenants.length}</span> Tenants • 
            <span className="font-medium ml-1">{owners.length}</span> Owners • 
            <span className="font-medium ml-1">{properties.length}</span> Properties
          </div>
        </div>
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Rental Overview</h3>
          <p className="text-gray-600 mb-6">No rental agreements found in the system.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{tenants.length}</div>
              <div className="text-sm text-gray-600">Total Tenants</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{owners.length}</div>
              <div className="text-sm text-gray-600">Property Owners</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{properties.length}</div>
              <div className="text-sm text-gray-600">Available Properties</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiHome className="flex-shrink-0 h-4 w-4 text-blue-600 mr-2" />
                      <div className="font-medium">{rental.property_title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{rental.tenant_name}</div>
                    <div className="text-sm text-gray-500">{rental.tenant_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{rental.owner_name}</div>
                    <div className="text-sm text-gray-500">{rental.owner_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiCalendar className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm">{new Date(rental.start_date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">to {new Date(rental.end_date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiDollarSign className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                      <div>{formatPrice(rental.rent_amount)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[rental.status]}`}>
                      {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminManageRentals;
