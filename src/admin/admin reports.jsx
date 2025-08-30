import { useState } from 'react';
import { FiArrowDown, FiSettings, FiTrendingUp, FiDollarSign, FiHome, FiUsers, FiFilter } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('rental');

  const rentalData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 6390 },
    { name: 'Jul', value: 5490 },
    { name: 'Aug', value: 6000 },
    { name: 'Sep', value: 8000 },
    { name: 'Oct', value: 7500 },
    { name: 'Nov', value: 8200 },
    { name: 'Dec', value: 9000 },
  ];

  const propertyData = [
    { name: 'Westlands', value: 400 },
    { name: 'Kilimani', value: 300 },
    { name: 'Karen', value: 300 },
    { name: 'CBD', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const summaryData = [
    { icon: <FiDollarSign className="w-6 h-6 text-blue-500" />, title: 'Total Revenue', value: 'KSh 4,240,000', change: '+12%', positive: true },
    { icon: <FiHome className="w-6 h-6 text-green-500" />, title: 'Occupancy Rate', value: '92%', change: '+5%', positive: true },
    { icon: <FiUsers className="w-6 h-6 text-purple-500" />, title: 'New Tenants', value: '24', change: '-3%', positive: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FiFilter className="mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <FiArrowDown className="mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveReport('rental')}
          className={`px-4 py-2 text-sm font-medium ${activeReport === 'rental' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Rental Income
        </button>
        <button
          onClick={() => setActiveReport('property')}
          className={`px-4 py-2 text-sm font-medium ${activeReport === 'property' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Property Distribution
        </button>
        <button
          onClick={() => setActiveReport('financial')}
          className={`px-4 py-2 text-sm font-medium ${activeReport === 'financial' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Financial Overview
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryData.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                {item.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <span className={`ml-2 text-sm ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
                            <FiTrendingUp className="inline mr-2" />
            {activeReport === 'rental' ? 'Monthly Rental Income' : activeReport === 'property' ? 'Property Distribution' : 'Financial Overview'}
          </h3>
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {activeReport === 'rental' ? (
              <BarChart data={rentalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6" name="Rental Income" />
              </BarChart>
            ) : activeReport === 'property' ? (
              <PieChart>
                <Pie
                  data={propertyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {propertyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={rentalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8B5CF6" name="Total Revenue" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;