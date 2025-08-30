import { useState, useEffect } from 'react';
import { FiHome, FiUsers, FiDollarSign, FiTrendingUp, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const OwnerDashboardOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalProperties: 0,
        activeRentals: 0,
        totalIncome: 0,
        availableProperties: 0,
        pendingRentals: 0
    });
    const [properties, setProperties] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOwnerData();
    }, []);

    const fetchOwnerData = async () => {
        setLoading(true);
        try {
            // Fetch owner's properties
            const propertiesResponse = await api.get('/my-properties');
            const ownerProperties = propertiesResponse.data.properties || [];

            // Fetch owner's rentals
            const rentalsResponse = await api.get('/rentals');
            const ownerRentals = rentalsResponse.data.rentals || [];

            setProperties(ownerProperties);
            setRentals(ownerRentals);

            // Calculate statistics
            const totalProperties = ownerProperties.length;
            const activeRentals = ownerRentals.filter(r => r.status === 'active').length;
            const availableProperties = ownerProperties.filter(p => p.status === 'available').length;
            const pendingRentals = ownerRentals.filter(r => r.status === 'pending').length;

            // Calculate total income (sum of all active rental amounts)
            const totalIncome = ownerRentals
                .filter(r => r.status === 'active')
                .reduce((sum, rental) => sum + (rental.rent_amount || 0), 0);

            setStats({
                totalProperties,
                activeRentals,
                totalIncome,
                availableProperties,
                pendingRentals
            });

        } catch (error) {
            console.error('Error fetching owner data:', error);
            toast.error('Failed to load dashboard data');
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
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Owner'}!</h1>
                        <p className="text-blue-100">Here's an overview of your rental portfolio</p>
                    </div>
                    <div className="hidden md:block">
                        <FiHome className="w-16 h-16 text-blue-200" />
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FiHome className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Properties</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FiUsers className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Rentals</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeRentals}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <FiDollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalIncome)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <FiCalendar className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Available</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.availableProperties}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Properties */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Properties</h2>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All Properties
                    </button>
                </div>
                {properties.length === 0 ? (
                    <div className="text-center py-8">
                        <FiHome className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No properties yet</p>
                        <p className="text-sm text-gray-400">Add your first property to get started</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {properties.slice(0, 3).map((property) => (
                            <div key={property.id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{property.title}</h3>
                                    <p className="text-sm text-gray-500">{property.address}, {property.city}</p>
                                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                                        <span>{property.bedrooms} beds</span>
                                        <span>{property.bathrooms} baths</span>
                                        <span className="font-medium text-green-600">{formatCurrency(property.rent_amount)}/month</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${property.status === 'available' ? 'bg-green-100 text-green-800' :
                                            property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Rentals */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Rentals</h2>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All Rentals
                    </button>
                </div>
                {rentals.length === 0 ? (
                    <div className="text-center py-8">
                        <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No rental agreements yet</p>
                        <p className="text-sm text-gray-400">Create rental agreements when tenants apply</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {rentals.slice(0, 3).map((rental) => (
                            <div key={rental.id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{rental.property_title}</h3>
                                    <p className="text-sm text-gray-500">Tenant: {rental.tenant_name}</p>
                                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                                        <span>{new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}</span>
                                        <span className="font-medium text-green-600">{formatCurrency(rental.rent_amount)}/month</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${rental.status === 'active' ? 'bg-green-100 text-green-800' :
                                            rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <FiHome className="w-6 h-6 text-blue-600 mr-3" />
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Add Property</p>
                            <p className="text-sm text-gray-500">List a new property</p>
                        </div>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <FiUsers className="w-6 h-6 text-green-600 mr-3" />
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Manage Rentals</p>
                            <p className="text-sm text-gray-500">View rental agreements</p>
                        </div>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <FiTrendingUp className="w-6 h-6 text-purple-600 mr-3" />
                        <div className="text-left">
                            <p className="font-medium text-gray-900">View Analytics</p>
                            <p className="text-sm text-gray-500">Check performance</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboardOverview;
