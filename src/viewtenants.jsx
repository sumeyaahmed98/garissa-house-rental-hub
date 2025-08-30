import { useState, useEffect } from 'react';
import { FiUser, FiPhone, FiMail, FiHome, FiEdit, FiTrash2, FiSearch, FiCalendar } from 'react-icons/fi';
import { FiDollarSign } from "react-icons/fi";
import { api } from './lib/api';
import toast from 'react-hot-toast';

const ViewTenants = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await api.get('/rentals');
      setTenants(response.data.rentals);
    } catch (error) {
      toast.error('Failed to fetch tenants');
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
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

  const filteredTenants = tenants.filter(tenant =>
    tenant.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.tenant_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.property_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h2 className="text-xl font-semibold">View Tenants</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search tenants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredTenants.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tenants Found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'No tenants match your search criteria.' : 'You don\'t have any active tenants yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant) => (
            <div key={tenant.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                  {tenant.tenant_name?.charAt(0) || 'T'}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">{tenant.tenant_name}</h3>
                  <p className="text-sm text-gray-500">Tenant since {new Date(tenant.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <FiMail className="text-gray-400 mr-2" />
                  <span className="text-sm">{tenant.tenant_email}</span>
                </div>
                <div className="flex items-center">
                  <FiHome className="text-gray-400 mr-2" />
                  <span className="text-sm">{tenant.property_title}</span>
                </div>
                <div className="flex items-center">
                  <FiDollarSign className="text-gray-400 mr-2" />
                  <span className="font-medium">{formatPrice(tenant.rent_amount)}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="text-gray-400 mr-2" />
                  <span className="text-sm">
                    {new Date(tenant.start_date).toLocaleDateString()} - {new Date(tenant.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    tenant.status === 'active' ? 'bg-green-100 text-green-800' :
                    tenant.status === 'expired' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                  </span>
                  <div className="flex space-x-2">
                    <a
                      href={`mailto:${tenant.tenant_email}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Email Tenant"
                    >
                      <FiMail />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {filteredTenants.length} of {tenants.length} tenants
        </div>
      </div>
    </div>
  );
};

export default ViewTenants;