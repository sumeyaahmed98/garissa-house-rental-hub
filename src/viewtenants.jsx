import { FiUser, FiPhone, FiMail, FiHome, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FiDollarSign } from "react-icons/fi";
const ViewTenants = () => {
  const tenants = [
    {
      id: 1,
      name: 'Ahmed Mohamed',
      phone: '+254712345678',
      email: 'ahmed.m@example.com',
      property: 'Garissa Heights #1',
      rent: 'KSh 15,000',
      joined: '2023-05-15'
    },
    {
      id: 2,
      name: 'Fatuma Abdi',
      phone: '+254723456789',
      email: 'fatuma.a@example.com',
      property: 'River View Apartments',
      rent: 'KSh 12,500',
      joined: '2023-06-01'
    },
    {
      id: 3,
      name: 'Omar Hassan',
      phone: '+254734567890',
      email: 'omar.h@example.com',
      property: 'Townhouse #2',
      rent: 'KSh 18,000',
      joined: '2023-04-10'
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">View Tenants</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search tenants..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                {tenant.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold">{tenant.name}</h3>
                <p className="text-sm text-gray-500">Tenant since {new Date(tenant.joined).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <FiPhone className="text-gray-400 mr-2" />
                <span>{tenant.phone}</span>
              </div>
              <div className="flex items-center">
                <FiMail className="text-gray-400 mr-2" />
                <span>{tenant.email}</span>
              </div>
              <div className="flex items-center">
                <FiHome className="text-gray-400 mr-2" />
                <span>{tenant.property}</span>
              </div>
              <div className="flex items-center">
                <FiDollarSign className="text-gray-400 mr-2" />
                <span className="font-medium">{tenant.rent}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <FiEdit2 />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">Showing {tenants.length} tenants</div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Load More
        </button>
      </div>
    </div>
  );
};

export default ViewTenants;