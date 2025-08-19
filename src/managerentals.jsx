import { FiHome, FiCalendar, FiDollarSign, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const ManageRentals = () => {
  const rentals = [
    {
      id: 1,
      property: 'Garissa Heights #1',
      tenant: 'Ahmed Mohamed',
      startDate: '2023-05-15',
      endDate: '2024-05-14',
      rent: 'KSh 15,000',
      status: 'active'
    },
    {
      id: 2,
      property: 'River View Apartments',
      tenant: 'Fatuma Abdi',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      rent: 'KSh 12,500',
      status: 'active'
    },
    {
      id: 3,
      property: 'Townhouse #2',
      tenant: 'Omar Hassan',
      startDate: '2023-04-10',
      endDate: '2023-10-09',
      rent: 'KSh 18,000',
      status: 'expired'
    },
  ];

  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Manage Rentals</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FiPlus className="mr-2" />
          New Rental
        </button>
      </div>

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
                    <div className="font-medium">{rental.property}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{rental.tenant}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiCalendar className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm">{new Date(rental.startDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">to {new Date(rental.endDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiDollarSign className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                    <div>{rental.rent}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[rental.status]}`}>
                    {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    <FiEdit2 className="inline mr-1" /> Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <FiTrash2 className="inline mr-1" /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div>Showing 1 to {rentals.length} of {rentals.length} rentals</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50" disabled>Previous</button>
          <button className="px-3 py-1 border rounded bg-blue-50 text-blue-600">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};

export default ManageRentals;