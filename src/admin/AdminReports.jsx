import { useState, useEffect } from 'react';
import { FiArrowDown, FiSettings, FiTrendingUp, FiDollarSign, FiHome, FiUsers, FiFilter } from 'react-icons/fi';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const AdminReports = () => {
    const [activeReport, setActiveReport] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProperties: 0,
        totalRentals: 0,
        activeRentals: 0,
        totalRevenue: 0,
        occupancyRate: 0
    });
    const [userStats, setUserStats] = useState({
        admins: 0,
        owners: 0,
        tenants: 0
    });
    const [propertyStats, setPropertyStats] = useState({
        available: 0,
        rented: 0,
        maintenance: 0
    });

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            // Fetch users data
            const usersResponse = await api.get('/admin/users');
            const users = usersResponse.data.users || [];

            // Fetch properties data
            const propertiesResponse = await api.get('/properties');
            const properties = propertiesResponse.data.properties || [];

            // Fetch rentals data
            const rentalsResponse = await api.get('/admin/rentals');
            const rentals = rentalsResponse.data.rentals || [];

            // Calculate user statistics
            const admins = users.filter(u => u.role === 'admin').length;
            const owners = users.filter(u => u.role === 'owner').length;
            const tenants = users.filter(u => u.role === 'tenant').length;

            // Calculate property statistics
            const available = properties.filter(p => p.status === 'available').length;
            const rented = properties.filter(p => p.status === 'rented').length;
            const maintenance = properties.filter(p => p.status === 'maintenance').length;

            // Calculate rental statistics
            const activeRentals = rentals.filter(r => r.status === 'active').length;
            const totalRevenue = rentals
                .filter(r => r.status === 'active')
                .reduce((sum, rental) => sum + (rental.rent_amount || 0), 0);

            const occupancyRate = properties.length > 0 ? Math.round((rented / properties.length) * 100) : 0;

            setStats({
                totalUsers: users.length,
                totalProperties: properties.length,
                totalRentals: rentals.length,
                activeRentals,
                totalRevenue,
                occupancyRate
            });

            setUserStats({ admins, owners, tenants });
            setPropertyStats({ available, rented, maintenance });

        } catch (error) {
            console.error('Error fetching report data:', error);
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
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
        <div className="space-y-6">
            {/* Header */}
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

            {/* Report Tabs */}
            <div className="flex space-x-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveReport('overview')}
                    className={`px-4 py-2 text-sm font-medium ${activeReport === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveReport('users')}
                    className={`px-4 py-2 text-sm font-medium ${activeReport === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    User Analytics
                </button>
                <button
                    onClick={() => setActiveReport('properties')}
                    className={`px-4 py-2 text-sm font-medium ${activeReport === 'properties' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Property Analytics
                </button>
                <button
                    onClick={() => setActiveReport('financial')}
                    className={`px-4 py-2 text-sm font-medium ${activeReport === 'financial' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Financial Overview
                </button>
            </div>

            {/* Overview Report */}
            {activeReport === 'overview' && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-blue-50">
                                    <FiUsers className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                                    <div className="mt-1 flex items-baseline">
                                        <p className="text-2xl font-semibold">{stats.totalUsers}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-green-50">
                                    <FiHome className="w-6 h-6 text-green-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-500">Total Properties</h3>
                                    <div className="mt-1 flex items-baseline">
                                        <p className="text-2xl font-semibold">{stats.totalProperties}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-purple-50">
                                    <FiDollarSign className="w-6 h-6 text-purple-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-500">Active Rentals</h3>
                                    <div className="mt-1 flex items-baseline">
                                        <p className="text-2xl font-semibold">{stats.activeRentals}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Platform Statistics */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FiTrendingUp className="mr-2" />
                            Platform Statistics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">User Distribution</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Admins</span>
                                        <span className="font-medium">{userStats.admins}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Property Owners</span>
                                        <span className="font-medium">{userStats.owners}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Tenants</span>
                                        <span className="font-medium">{userStats.tenants}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Property Status</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Available</span>
                                        <span className="font-medium text-green-600">{propertyStats.available}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Rented</span>
                                        <span className="font-medium text-blue-600">{propertyStats.rented}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Maintenance</span>
                                        <span className="font-medium text-yellow-600">{propertyStats.maintenance}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* User Analytics Report */}
            {activeReport === 'users' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4">User Analytics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <FiUsers className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <h4 className="font-semibold text-blue-900">Total Users</h4>
                                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <FiHome className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <h4 className="font-semibold text-green-900">Property Owners</h4>
                                <p className="text-2xl font-bold text-green-600">{userStats.owners}</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <FiUsers className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <h4 className="font-semibold text-purple-900">Tenants</h4>
                                <p className="text-2xl font-bold text-purple-600">{userStats.tenants}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Property Analytics Report */}
            {activeReport === 'properties' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4">Property Analytics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <FiHome className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <h4 className="font-semibold text-green-900">Available</h4>
                                <p className="text-2xl font-bold text-green-600">{propertyStats.available}</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <FiHome className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <h4 className="font-semibold text-blue-900">Rented</h4>
                                <p className="text-2xl font-bold text-blue-600">{propertyStats.rented}</p>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <FiHome className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                <h4 className="font-semibold text-yellow-900">Maintenance</h4>
                                <p className="text-2xl font-bold text-yellow-600">{propertyStats.maintenance}</p>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Occupancy Rate</h4>
                            <div className="flex items-center">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${stats.occupancyRate}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-600">{stats.occupancyRate}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Financial Overview Report */}
            {activeReport === 'financial' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center p-6 bg-green-50 rounded-lg">
                                <FiDollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h4 className="font-semibold text-green-900 mb-2">Total Revenue</h4>
                                <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
                                <p className="text-sm text-green-700 mt-2">From active rentals</p>
                            </div>
                            <div className="text-center p-6 bg-blue-50 rounded-lg">
                                <FiHome className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <h4 className="font-semibold text-blue-900 mb-2">Active Rentals</h4>
                                <p className="text-3xl font-bold text-blue-600">{stats.activeRentals}</p>
                                <p className="text-sm text-blue-700 mt-2">Currently generating revenue</p>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Revenue Breakdown</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Monthly Revenue</span>
                                    <span className="font-medium">{formatCurrency(stats.totalRevenue)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Active Rental Agreements</span>
                                    <span className="font-medium">{stats.activeRentals}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Average Monthly Rent</span>
                                    <span className="font-medium">
                                        {stats.activeRentals > 0 ? formatCurrency(stats.totalRevenue / stats.activeRentals) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
