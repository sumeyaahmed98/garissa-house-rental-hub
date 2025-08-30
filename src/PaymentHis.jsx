import { FiDollarSign, FiCalendar, FiArrowDown, FiSettings } from 'react-icons/fi';
import React, { useState } from "react";



const PaymentHis = () => {
  const payments = [
    {
      id: 1,
      tenant: 'Ahmed Mohamed',
      property: 'Garissa Heights #1',
      amount: 'KSh 15,000',
      date: '2023-06-01',
      method: 'M-Pesa',
      status: 'completed'
    },
    {
      id: 2,
      tenant: 'Fatuma Abdi',
      property: 'River View Apartments',
      amount: 'KSh 12,500',
      date: '2023-06-01',
      method: 'Bank Transfer',
      status: 'completed'
    },
    {
      id: 3,
      tenant: 'Omar Hassan',
      property: 'Townhouse #2',
      amount: 'KSh 18,000',
      date: '2023-05-01',
      method: 'M-Pesa',
      status: 'completed'
    },
    {
      id: 4,
      tenant: 'Ahmed Mohamed',
      property: 'Garissa Heights #1',
      amount: 'KSh 15,000',
      date: '2023-05-01',
      method: 'M-Pesa',
      status: 'completed'
    },
  ];

  const statusStyles = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Payment History</h2>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiFilter className="mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <FiArrowDown className="mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{payment.tenant}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{payment.property}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{payment.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiCalendar className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                    <div>{new Date(payment.date).toLocaleDateString()}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>{payment.method}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[payment.status]}`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div>Showing 1 to {payments.length} of {payments.length} payments</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50" disabled>Previous</button>
          <button className="px-3 py-1 border rounded bg-blue-50 text-blue-600">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHis;