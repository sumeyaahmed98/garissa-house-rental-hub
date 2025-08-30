import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiHome, FiDollarSign, FiStar, FiX } from 'react-icons/fi';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const AdvancedPropertySearch = ({ onSearchResults, showFilters = true }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        city: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        bathrooms: '',
        propertyType: '',
        amenities: [],
        status: 'available'
    });
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [popularCities, setPopularCities] = useState([]);

    const amenitiesList = [
        'Parking', 'Security', 'Water', 'Electricity', 'Internet', 'Garden', 'Balcony', 'Air Conditioning'
    ];

    const propertyTypes = [
        'Apartment', 'House', 'Studio', 'Penthouse', 'Villa', 'Townhouse'
    ];

    useEffect(() => {
        loadRecentSearches();
        loadPopularCities();
    }, []);

    const loadRecentSearches = () => {
        const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        setRecentSearches(searches.slice(0, 5));
    };

    const loadPopularCities = async () => {
        try {
            const response = await api.get('/properties');
            const properties = response.data.properties || [];
            const cities = [...new Set(properties.map(p => p.city).filter(Boolean))];
            setPopularCities(cities.slice(0, 6));
        } catch (error) {
            console.error('Error loading popular cities:', error);
        }
    };

    const saveSearch = (searchData) => {
        const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        const newSearch = {
            ...searchData,
            timestamp: new Date().toISOString()
        };
        const updatedSearches = [newSearch, ...searches.filter(s => s.searchTerm !== searchData.searchTerm)].slice(0, 10);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        setRecentSearches(updatedSearches.slice(0, 5));
    };

    const handleSearch = async () => {
        if (!searchTerm.trim() && !Object.values(filters).some(v => v && v !== '')) {
            toast.error('Please enter a search term or apply filters');
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams();

            if (searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }

            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '' && value !== 'available') {
                    if (Array.isArray(value)) {
                        value.forEach(v => params.append(key, v));
                    } else {
                        params.append(key, value);
                    }
                }
            });

            const response = await api.get(`/properties?${params.toString()}`);
            const results = response.data.properties || [];

            // Save search
            saveSearch({
                searchTerm,
                filters,
                resultsCount: results.length
            });

            onSearchResults(results);
            toast.success(`Found ${results.length} properties`);
        } catch (error) {
            console.error('Error searching properties:', error);
            toast.error('Failed to search properties');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleAmenityToggle = (amenity) => {
        setFilters(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const clearFilters = () => {
        setFilters({
            city: '',
            minPrice: '',
            maxPrice: '',
            bedrooms: '',
            bathrooms: '',
            propertyType: '',
            amenities: [],
            status: 'available'
        });
        setSearchTerm('');
    };

    const loadRecentSearch = (search) => {
        setSearchTerm(search.searchTerm);
        setFilters(search.filters);
    };

    const quickSearch = (city) => {
        setFilters(prev => ({ ...prev, city }));
        handleSearch();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            {/* Main Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search properties by location, features, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>

                <div className="flex gap-2">
                    {showFilters && (
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`flex items-center px-4 py-3 border rounded-lg transition-colors ${showAdvancedFilters
                                    ? 'bg-blue-50 border-blue-300 text-blue-600'
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <FiFilter className="mr-2" />
                            Filters
                        </button>
                    )}

                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                            <FiSearch className="mr-2" />
                        )}
                        Search
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && showAdvancedFilters && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* City */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <div className="relative">
                                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    value={filters.city}
                                    onChange={(e) => handleFilterChange('city', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Cities</option>
                                    {popularCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                            <div className="relative">
                                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                            <div className="relative">
                                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Bedrooms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                            <select
                                value={filters.bedrooms}
                                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Any</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4+</option>
                            </select>
                        </div>

                        {/* Bathrooms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                            <select
                                value={filters.bathrooms}
                                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Any</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3+</option>
                            </select>
                        </div>

                        {/* Property Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                            <div className="relative">
                                <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    value={filters.propertyType}
                                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Types</option>
                                    {propertyTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {amenitiesList.map(amenity => (
                                <label key={amenity} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.amenities.includes(amenity)}
                                        onChange={() => handleAmenityToggle(amenity)}
                                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="mt-4 flex justify-between items-center">
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                        >
                            <FiX className="mr-1" />
                            Clear all filters
                        </button>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="border-t border-gray-200 pt-6">
                {/* Popular Cities */}
                {popularCities.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Cities</h3>
                        <div className="flex flex-wrap gap-2">
                            {popularCities.map(city => (
                                <button
                                    key={city}
                                    onClick={() => quickSearch(city)}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
                        <div className="space-y-2">
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => loadRecentSearch(search)}
                                    className="flex items-center justify-between w-full p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center">
                                        <FiSearch className="mr-2 text-gray-400" />
                                        <span>{search.searchTerm || `${search.filters.city || 'Filtered'} search`}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{search.resultsCount} results</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvancedPropertySearch;
