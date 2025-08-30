import { useState, useEffect } from 'react';
import { FiHome, FiCalendar, FiDollarSign, FiEdit, FiTrash2, FiPlus, FiUser, FiPhone, FiMail, FiX, FiFileText } from 'react-icons/fi';
import { api } from './lib/api';
import toast from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

const ManageRentals = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRental, setNewRental] = useState({
    property_id: '',
    tenant_id: '',
    start_date: '',
    end_date: '',
    rent_amount: '',
    security_deposit: '',
    payment_cycle: 'monthly',
    utilities_included: false,
    parking_included: false,
    notes: ''
  });

  useEffect(() => {
    fetchRentals();
    fetchProperties();
    fetchTenants();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await api.get('/rentals');
      setRentals(response.data.rentals);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Access denied. You need to be logged in as an owner to manage rentals.');
      } else {
        toast.error('Failed to fetch rentals');
      }
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await api.get('/my-properties');
      setProperties(response.data.properties);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Access denied. You need to be logged in as an owner to view properties.');
      } else {
        console.error('Error fetching properties:', error);
      }
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await api.get('/users');
      const tenantUsers = response.data.users.filter(user => user.role === 'tenant');
      setTenants(tenantUsers);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const validateRentalForm = () => {
    if (!newRental.property_id) {
      toast.error('Please select a property');
      return false;
    }
    if (!newRental.tenant_id) {
      toast.error('Please select a tenant');
      return false;
    }
    if (!newRental.start_date) {
      toast.error('Please select a start date');
      return false;
    }
    if (!newRental.end_date) {
      toast.error('Please select an end date');
      return false;
    }
    if (!newRental.rent_amount || newRental.rent_amount <= 0) {
      toast.error('Please enter a valid rent amount');
      return false;
    }
    
    const startDate = new Date(newRental.start_date);
    const endDate = new Date(newRental.end_date);
    const today = new Date();
    
    if (startDate < today) {
      toast.error('Start date cannot be in the past');
      return false;
    }
    if (endDate <= startDate) {
      toast.error('End date must be after start date');
      return false;
    }
    
    return true;
  };

  const handleCreateRental = async (e) => {
    e.preventDefault();
    
    if (!validateRentalForm()) {
      return;
    }
    
    setCreating(true);
    try {
      const rentalData = {
        ...newRental,
        rent_amount: parseFloat(newRental.rent_amount),
        security_deposit: newRental.security_deposit ? parseFloat(newRental.security_deposit) : 0
      };
      
      await api.post('/rentals', rentalData);
      toast.success('Rental agreement created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchRentals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create rental agreement');
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setNewRental({
      property_id: '',
      tenant_id: '',
      start_date: '',
      end_date: '',
      rent_amount: '',
      security_deposit: '',
      payment_cycle: 'monthly',
      utilities_included: false,
      parking_included: false,
      notes: ''
    });
  };

  const handleDeleteRental = async (rentalId) => {
    if (window.confirm('Are you sure you want to terminate this rental agreement? This action cannot be undone.')) {
      try {
        await api.delete(`/rentals/${rentalId}`);
        toast.success('Rental agreement terminated successfully');
        fetchRentals();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to terminate rental agreement');
      }
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

  const getSelectedProperty = () => {
    return properties.find(p => p.id == newRental.property_id);
  };

  const getSelectedTenant = () => {
    return tenants.find(t => t.id == newRental.tenant_id);
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
        <div>
          <h2 className="text-xl font-semibold">Manage Rental Agreements</h2>
          <p className="text-gray-600 mt-1">Create and manage rental agreements with tenants</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          New Rental Agreement
        </button>
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rental Agreements Found</h3>
          <p className="text-gray-600 mb-4">Create your first rental agreement to start managing your properties.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Agreement
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteRental(rental.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="inline mr-1" /> Terminate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enhanced Create Rental Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center">
                <FiFileText className="mr-2" />
                Create New Rental Agreement
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateRental} className="space-y-6">
              {/* Property and Tenant Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiHome className="inline mr-1" />
                    Property *
                  </label>
                  <select
                    value={newRental.property_id}
                    onChange={(e) => setNewRental({ ...newRental, property_id: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Property</option>
                    {properties.filter(p => p.status === 'available').map(property => (
                      <option key={property.id} value={property.id}>
                        {property.title} - {property.address}
                      </option>
                    ))}
                  </select>
                  {getSelectedProperty() && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                      <strong>Property Details:</strong> {getSelectedProperty().bedrooms} bed, {getSelectedProperty().bathrooms} bath • {getSelectedProperty().city}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUser className="inline mr-1" />
                    Tenant *
                  </label>
                  <select
                    value={newRental.tenant_id}
                    onChange={(e) => setNewRental({ ...newRental, tenant_id: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Tenant</option>
                    {tenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name} ({tenant.email})
                      </option>
                    ))}
                  </select>
                  {getSelectedTenant() && (
                    <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                      <strong>Tenant:</strong> {getSelectedTenant().name} • {getSelectedTenant().email}
                    </div>
                  )}
                </div>
              </div>

              {/* Rental Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiCalendar className="inline mr-1" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={newRental.start_date}
                    onChange={(e) => setNewRental({ ...newRental, start_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiCalendar className="inline mr-1" />
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={newRental.end_date}
                    onChange={(e) => setNewRental({ ...newRental, end_date: e.target.value })}
                    min={newRental.start_date || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Financial Terms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiDollarSign className="inline mr-1" />
                    Monthly Rent *
                  </label>
                  <input
                    type="number"
                    value={newRental.rent_amount}
                    onChange={(e) => setNewRental({ ...newRental, rent_amount: e.target.value })}
                    min="0"
                    step="100"
                    required
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiDollarSign className="inline mr-1" />
                    Security Deposit
                  </label>
                  <input
                    type="number"
                    value={newRental.security_deposit}
                    onChange={(e) => setNewRental({ ...newRental, security_deposit: e.target.value })}
                    min="0"
                    step="100"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Cycle
                  </label>
                  <select
                    value={newRental.payment_cycle}
                    onChange={(e) => setNewRental({ ...newRental, payment_cycle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>

              {/* Additional Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newRental.utilities_included}
                      onChange={(e) => setNewRental({ ...newRental, utilities_included: e.target.checked })}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Utilities Included</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newRental.parking_included}
                      onChange={(e) => setNewRental({ ...newRental, parking_included: e.target.checked })}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Parking Included</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={newRental.notes}
                  onChange={(e) => setNewRental({ ...newRental, notes: e.target.value })}
                  rows={3}
                  placeholder="Any additional terms or notes for this rental agreement..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiFileText className="mr-2" />
                      Create Agreement
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRentals;