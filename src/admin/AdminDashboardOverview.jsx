import { useState, useEffect } from 'react';
import { FiUsers, FiFileText, FiTrendingUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { FaHome } from 'react-icons/fa';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const AdminDashboardOverview = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProperties: 0,
        totalRentals: 0,
        activeRentals: 0,
        pendingRentals: 0,
        systemHealth: 'healthy'
    });
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch users count
            const usersResponse = await api.get('/admin/users');
            const totalUsers = usersResponse.data.users?.length || 0;

            // Fetch properties count
            const propertiesResponse = await api.get('/properties');
            const totalProperties = propertiesResponse.data.properties?.length || 0;

            // Fetch rentals data
            const rentalsResponse = await api.get('/admin/rentals');
            const rentals = rentalsResponse.data.rentals || [];
            const totalRentals = rentals.length;
            const activeRentals = rentals.filter(r => r.status === 'active').length;
            const pendingRentals = rentals.filter(r => r.status === 'pending').length;

            setStats({
                totalUsers,
                totalProperties,
                totalRentals,
                activeRentals,
                pendingRentals,
                systemHealth: 'healthy'
            });

            // Get recent activity (latest users, properties, rentals)
            const recentUsers = usersResponse.data.users?.slice(0, 5) || [];
            const recentProperties = propertiesResponse.data.properties?.slice(0, 5) || [];
            const recentRentals = rentals.slice(0, 5);

            setRecentActivity([
                ...recentUsers.map(user => ({ ...user, type: 'user', date: user.created_at })),
                ...recentProperties.map(prop => ({ ...prop, type: 'property', date: prop.created_at })),
                ...recentRentals.map(rental => ({ ...rental, type: 'rental', date: rental.created_at }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'user': return <FiUsers className="w-4 h-4 text-blue-500" />;
            case 'property': return <FaHome className="w-4 h-4 text-green-500" />;
            case 'rental': return <FiFileText className="w-4 h-4 text-purple-500" />;
            default: return <FiTrendingUp className="w-4 h-4 text-gray-500" />;
        }
    };

    const getActivityText = (item) => {
        switch (item.type) {
            case 'user':
                return `${item.name} (${item.role}) joined the platform`;
            case 'property':
                return `New property "${item.title}" was added`;
            case 'rental':
                return `New rental agreement created for ${item.property_title}`;
            default:
                return 'Activity recorded';
        }
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
            {/* System Health Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
                    <div className="flex items-center space-x-2">
                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-600">All Systems Operational</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                            <FiUsers className="w-8 h-8 text-blue-600" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-blue-600">Total Users</p>
                                <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                            <FaHome className="w-8 h-8 text-green-600" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-600">Properties</p>
                                <p className="text-2xl font-bold text-green-900">{stats.totalProperties}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center">
                            <FiFileText className="w-8 h-8 text-purple-600" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-purple-600">Active Rentals</p>
                                <p className="text-2xl font-bold text-purple-900">{stats.activeRentals}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center">
                            <FiAlertCircle className="w-8 h-8 text-yellow-600" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-yellow-600">Pending Rentals</p>
                                <p className="text-2xl font-bold text-yellow-900">{stats.pendingRentals}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <FiUsers className="w-6 h-6 text-blue-600 mr-3" />
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Manage Users</p>
                            <p className="text-sm text-gray-500">View and manage user accounts</p>
                        </div>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <FaHome className="w-6 h-6 text-green-600 mr-3" />
                        <div className="text-left">
                            <p className="font-medium text-gray-900">View Properties</p>
                            <p className="text-sm text-gray-500">Monitor all property listings</p>
                        </div>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <FiFileText className="w-6 h-6 text-purple-600 mr-3" />
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Rental Overview</p>
                            <p className="text-sm text-gray-500">Track all rental agreements</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                {recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                        <FiTrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No recent activity</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center p-3 border border-gray-100 rounded-lg">
                                {getActivityIcon(activity.type)}
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900">{getActivityText(activity)}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


        </div>
    );
};

export default AdminDashboardOverview;
