import { useState } from 'react';
import { FiSettings, FiArrowDown, FiCheck, FiAlertCircle, FiClock } from 'react-icons/fi';

const Payments = () => {
  const [payments, setPayments] = useState([
    { id: 1, invoice: 'INV-2023-001', tenant: 'John Doe', property: 'Luxury Apartment', amount: 'KSh 45,000', date: '2023-06-01', status: 'Paid', method: 'M-Pesa' },
    { id: 2, invoice: 'INV-2023-002', tenant: 'Jane Smith', property: 'Garden Villas', amount: 'KSh 65,000', date: '2023-06-03', status: 'Paid', method: 'Bank Transfer' },
    { id: 3, invoice: 'INV-2023-003', tenant: 'Mike Johnson', property: 'City View Towers', amount: 'KSh 38,000', date: '2023-06-05', status: 'Overdue', method: null },
    { id: 4, invoice: 'INV-2023-004', tenant: 'Sarah Williams', property: 'Riverside Apartments', amount: 'KSh 52,000', date: '2023-06-10', status: 'Pending', method: null },
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPayments = payments.filter(payment => {
    if (activeFilter === 'all') return true;
    return payment.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <FiCheck className="text-green-500" />;
      case 'Overdue':
        return <FiAlertCircle className="text-red-500" />;
      case 'Pending':
        return <FiClock className="text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800">Payment Records</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="p-2">
                  <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => setActiveFilter('all')}>
                    All Payments
                  </div>
                  <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => setActiveFilter('paid')}>
                    Paid
                  </div>
                  <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => setActiveFilter('pending')}>
                    Pending
                  </div>
                  <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => setActiveFilter('overdue')}>
                    Overdue
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <FiArrowDown className="mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{payment.invoice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.tenant}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.property}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.method || '—'}
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

export default Payments;