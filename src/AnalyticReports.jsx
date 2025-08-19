import { FiBarChart2, FiDollarSign, FiPieChart, FiDownload } from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AnalyticsReports = () => {
  // Sample data for charts
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (KSh)',
        data: [120000, 190000, 150000, 180000, 210000, 240500],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  };

  const occupancyData = {
    labels: ['Occupied', 'Vacant'],
    datasets: [
      {
        data: [6, 2],
        backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(209, 213, 219, 0.7)'],
        borderWidth: 1,
      },
    ],
  };

  const paymentMethodsData = {
    labels: ['M-Pesa', 'Bank Transfer', 'Cash'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)'],
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Analytics & Reports</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FiDownload className="mr-2" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center">
              <FiBarChart2 className="mr-2 text-blue-600" />
              Monthly Revenue
            </h3>
            <select className="text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
          <div className="h-64">
            <Bar
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center">
              <FiPieChart className="mr-2 text-green-600" />
              Occupancy Rate
            </h3>
          </div>
          <div className="h-64">
            <Pie
              data={occupancyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-medium mb-4">Total Revenue</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">KSh 1,095,500</span>
            <span className="ml-2 text-sm text-green-500">+12%</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Year to date</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-medium mb-4">Average Rent</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">KSh 15,183</span>
            <span className="ml-2 text-sm text-green-500">+5%</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Per property</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-medium mb-4">Occupancy Rate</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">75%</span>
            <span className="ml-2 text-sm text-green-500">+8%</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Current month</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center">
            <FiDollarSign className="mr-2 text-yellow-600" />
            Payment Methods
          </h3>
        </div>
        <div className="h-64">
          <Pie
            data={paymentMethodsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;