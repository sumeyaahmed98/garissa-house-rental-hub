import { useState, useEffect } from 'react';
import { FiHome, FiHeart, FiSearch, FiUser, FiTrendingUp, FiMapPin } from 'react-icons/fi';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';

const TenantDashboardOverview = () => {
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchFilters, setSearchFilters] = useState({
        city: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        propertyType: ''
    });

    useEffect(() => {
        fetchTenantData();
    }, []);

    const fetchTenantData = async () => {
        setLoading(true);
        try {
            // Fetch available properties
            const propertiesResponse = await api.get('/properties');
            const availableProperties = propertiesResponse.data.properties?.filter(p => p.status === 'available') || [];

            // Fetch user's favorites
            const favoritesResponse = await api.get('/favorites');
            const userFavorites = favoritesResponse.data.properties || [];

            setProperties(availableProperties);
            setFavorites(userFavorites);

        } catch (error) {
            console.error('Error fetching tenant data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(searchFilters).forEach(([key, value]) => {
                if (value && value !== '') {
                    params.append(key, value);
                }
            });

            const response = await api.get(`/properties?${params.toString()}`);
            const filteredProperties = response.data.properties?.filter(p => p.status === 'available') || [];
            setProperties(filteredProperties);
        } catch (error) {
            console.error('Error searching properties:', error);
            toast.error('Failed to search properties');
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteToggle = async (propertyId, isFavorite) => {
        try {
            if (isFavorite) {
                await api.delete(`/properties/${propertyId}/favorite`);
                setFavorites(prev => prev.filter(p => p.id !== propertyId));
                toast.success('Removed from favorites');
            } else {
                await api.post(`/properties/${propertyId}/favorite`);
                const property = properties.find(p => p.id === propertyId);
                if (property) {
                    setFavorites(prev => [...prev, property]);
                }
                toast.success('Added to favorites');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Failed to update favorites');
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
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Tenant'}!</h1>
                        <p className="text-green-100">Find your perfect rental home</p>
                    </div>
                    <div className="hidden md:block">
                        <FiHome className="w-16 h-16 text-green-200" />
                    </div>
                </div>
            </div>

            {/* Quick Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Search</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input
                        type="text"
                        placeholder="City"
                        value={searchFilters.city}
                        onChange={(e) => setSearchFilters({ ...searchFilters, city: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={searchFilters.minPrice}
                        onChange={(e) => setSearchFilters({ ...searchFilters, minPrice: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={searchFilters.maxPrice}
                        onChange={(e) => setSearchFilters({ ...searchFilters, maxPrice: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <select
                        value={searchFilters.bedrooms}
                        onChange={(e) => setSearchFilters({ ...searchFilters, bedrooms: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">Bedrooms</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4+ Bedrooms</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                        <FiSearch className="w-4 h-4 mr-2" />
                        Search
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FiHome className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Available Properties</p>
                            <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <FiHeart className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Favorites</p>
                            <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FiTrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Recent Views</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Properties */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Featured Properties</h2>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        View All Properties
                    </button>
                </div>
                {properties.length === 0 ? (
                    <div className="text-center py-8">
                        <FiHome className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No properties available</p>
                        <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.slice(0, 6).map((property) => (
                            <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                    <div className="flex items-center justify-center h-48 bg-gray-100">
                                        <FiHome className="w-12 h-12 text-gray-400" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2 flex items-center">
                                        <FiMapPin className="w-4 h-4 mr-1" />
                                        {property.address}, {property.city}
                                    </p>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span>{property.bedrooms} beds</span>
                                            <span>{property.bathrooms} baths</span>
                                        </div>
                                        <span className="font-semibold text-green-600">{formatCurrency(property.rent_amount)}/month</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleFavoriteToggle(property.id, favorites.some(f => f.id === property.id))}
                                            className={`p-2 rounded-full ${favorites.some(f => f.id === property.id)
                                                    ? 'text-red-500 bg-red-50'
                                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                }`}
                                        >
                                            <FiHeart className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* My Favorites */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">My Favorites</h2>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        View All Favorites
                    </button>
                </div>
                {favorites.length === 0 ? (
                    <div className="text-center py-8">
                        <FiHeart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No favorite properties yet</p>
                        <p className="text-sm text-gray-400">Start browsing and save your favorite properties</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.slice(0, 3).map((property) => (
                            <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                    <div className="flex items-center justify-center h-48 bg-gray-100">
                                        <FiHome className="w-12 h-12 text-gray-400" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2 flex items-center">
                                        <FiMapPin className="w-4 h-4 mr-1" />
                                        {property.address}, {property.city}
                                    </p>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span>{property.bedrooms} beds</span>
                                            <span>{property.bathrooms} baths</span>
                                        </div>
                                        <span className="font-semibold text-green-600">{formatCurrency(property.rent_amount)}/month</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleFavoriteToggle(property.id, true)}
                                            className="p-2 rounded-full text-red-500 bg-red-50"
                                        >
                                            <FiHeart className="w-4 h-4" />
                                        </button>
                                    </div>
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
                        <FiSearch className="w-6 h-6 text-blue-600 mr-3" />
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Advanced Search</p>
                            <p className="text-sm text-gray-500">Find specific properties</p>
                        </div>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <FiHeart className="w-6 h-6 text-red-600 mr-3" />
                        <div className="text-left">
                            <p className="font-medium text-gray-900">My Favorites</p>
                            <p className="text-sm text-gray-500">View saved properties</p>
                        </div>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <FiUser className="w-6 h-6 text-green-600 mr-3" />
                        <div className="text-left">
                            <p className="font-medium text-gray-900">My Profile</p>
                            <p className="text-sm text-gray-500">Update preferences</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TenantDashboardOverview;
