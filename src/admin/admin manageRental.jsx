import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiCalendar } from 'react-icons/fi';

const ManageRentals = () => {
  const [rentals, setRentals] = useState([
    { id: 1, property: 'Luxury Apartment', tenant: 'John Doe', startDate: '2023-01-15', endDate: '2024-01-14', rent: 'KSh 45,000', status: 'Active' },
    { id: 2, property: 'Garden Villas', tenant: 'Jane Smith', startDate: '2023-03-10', endDate: '2024-03-09', rent: 'KSh 65,000', status: 'Active' },
    { id: 3, property: 'City View Towers', tenant: 'Mike Johnson', startDate: '2023-02-01', endDate: '2023-11-30', rent: 'KSh 38,000', status: 'Ending Soon' },
    { id: 4, property: 'Riverside Apartments', tenant: 'Sarah Williams', startDate: '2023-05-20', endDate: '2024-05-19', rent: 'KSh 52,000', status: 'Active' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentRental, setCurrentRental] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredRentals = rentals.filter(rental => {
    if (activeTab === 'all') return true;
    return rental.status.toLowerCase().includes(activeTab.toLowerCase());
  });

  const handleGenerateContract = (id) => {
    console.log(`Generating contract for rental ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800">Rental Agreements</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FiPlus className="mr-2" />
          New Rental Agreement
        </button>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          All Rentals
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab('ending')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'ending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Ending Soon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Rent</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rental.property}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rental.tenant}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1 text-gray-400" />
                      {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rental.rent}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rental.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {rental.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button onClick={() => handleGenerateContract(rental.id)} className="text-gray-600 hover:text-gray-900" title="Generate Contract">
                      <FiFileText />
                    </button>
                    <button onClick={() => { setCurrentRental(rental); setShowModal(true); }} className="text-blue-600 hover:text-blue-900" title="Edit">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => setRentals(rentals.filter(r => r.id !== rental.id))} className="text-red-600 hover:text-red-900" title="Delete">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageRentals;