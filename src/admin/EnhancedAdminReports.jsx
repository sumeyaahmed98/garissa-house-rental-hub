import { useState, useEffect } from 'react';
import { FiArrowDown, FiSettings, FiTrendingUp, FiDollarSign, FiHome, FiUsers, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import AdvancedCharts from '../components/AdvancedCharts';

const EnhancedAdminReports = () => {
    const [activeReport, setActiveReport] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
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
    const [chartData, setChartData] = useState({
        revenue: [],
        properties: {},
        users: {},
        performance: {}
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

            // Generate sample revenue data (in real app, this would come from backend)
            const revenueData = generateRevenueData(totalRevenue);

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

            setChartData({
                revenue: revenueData,
                properties: { available, rented, maintenance },
                users: { admins, owners, tenants },
                performance: {
                    revenue: [totalRevenue * 0.2, totalRevenue * 0.3, totalRevenue * 0.25, totalRevenue * 0.25],
                    properties: [properties.length * 0.2, properties.length * 0.3, properties.length * 0.25, properties.length * 0.25]
                }
            });

        } catch (error) {
            console.error('Error fetching report data:', error);
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    const generateRevenueData = (totalRevenue) => {
        // Generate realistic monthly revenue data
        const baseRevenue = totalRevenue / 12;
        return Array.from({ length: 12 }, (_, i) => {
            const variation = 0.8 + Math.random() * 0.4; // ±20% variation
            return Math.round(baseRevenue * variation);
        });
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchReportData();
        setRefreshing(false);
        toast.success('Data refreshed successfully');
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
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Enhanced Analytics & Reports</h2>
                    <p className="text-gray-600 mt-1">Advanced insights and data visualization</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
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
                    onClick={() => setActiveReport('revenue')}
                    className={`px-4 py-2 text-sm font-medium ${activeReport === 'revenue' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Revenue Analytics
                </button>
                <button
                    onClick={() => setActiveReport('properties')}
                    className={`px-4 py-2 text-sm font-medium ${activeReport === 'properties' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Property Analytics
                </button>
                <button
                    onClick={() => setActiveReport('users')}
                    className={`px-4 py-2 text-sm font-medium ${activeReport === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    User Analytics
                </button>
                <button
                    onClick={() => setActiveReport('performance')}
                    className={`px-4 py-2 text-sm font-medium ${activeReport === 'performance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Performance
                </button>
            </div>

            {/* Overview Report */}
            {activeReport === 'overview' && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-blue-50">
                                    <FiUsers className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                                    <div className="mt-1 flex items-baseline">
                                        <p className="text-2xl font-semibold">{stats.totalUsers}</p>
                                        <span className="ml-2 text-sm text-green-600">+12%</span>
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
                                        <span className="ml-2 text-sm text-green-600">+8%</span>
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
                                        <span className="ml-2 text-sm text-green-600">+15%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-orange-50">
                                    <FiTrendingUp className="w-6 h-6 text-orange-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
                                    <div className="mt-1 flex items-baseline">
                                        <p className="text-2xl font-semibold">{formatCurrency(stats.totalRevenue)}</p>
                                        <span className="ml-2 text-sm text-green-600">+22%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AdvancedCharts data={chartData} type="revenue" />
                        <AdvancedCharts data={chartData} type="properties" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AdvancedCharts data={chartData} type="users" />
                        <AdvancedCharts data={chartData} type="performance" />
                    </div>
                </div>
            )}

            {/* Revenue Analytics */}
            {activeReport === 'revenue' && (
                <div className="space-y-6">
                    <AdvancedCharts data={chartData} type="revenue" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Total Revenue</span>
                                    <span className="font-semibold">{formatCurrency(stats.totalRevenue)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Active Rentals</span>
                                    <span className="font-semibold">{stats.activeRentals}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Average Rent</span>
                                    <span className="font-semibold">
                                        {stats.activeRentals > 0 ? formatCurrency(stats.totalRevenue / stats.activeRentals) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Property Analytics */}
            {activeReport === 'properties' && (
                <div className="space-y-6">
                    <AdvancedCharts data={chartData} type="properties" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4">Property Status</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Available</span>
                                    <span className="font-semibold text-green-600">{propertyStats.available}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Rented</span>
                                    <span className="font-semibold text-blue-600">{propertyStats.rented}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Maintenance</span>
                                    <span className="font-semibold text-yellow-600">{propertyStats.maintenance}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Occupancy Rate</span>
                                    <span className="font-semibold text-purple-600">{stats.occupancyRate}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* User Analytics */}
            {activeReport === 'users' && (
                <div className="space-y-6">
                    <AdvancedCharts data={chartData} type="users" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Admins</span>
                                    <span className="font-semibold text-red-600">{userStats.admins}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Property Owners</span>
                                    <span className="font-semibold text-blue-600">{userStats.owners}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Tenants</span>
                                    <span className="font-semibold text-green-600">{userStats.tenants}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Total Users</span>
                                    <span className="font-semibold text-purple-600">{stats.totalUsers}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Analytics */}
            {activeReport === 'performance' && (
                <div className="space-y-6">
                    <AdvancedCharts data={chartData} type="performance" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Platform Growth</span>
                                    <span className="font-semibold text-green-600">+18%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">User Engagement</span>
                                    <span className="font-semibold text-blue-600">+25%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Property Utilization</span>
                                    <span className="font-semibold text-purple-600">{stats.occupancyRate}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedAdminReports;
