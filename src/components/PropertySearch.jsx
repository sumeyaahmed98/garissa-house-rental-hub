import React, { useState } from 'react';
import { FiSearch, FiSettings, FiMapPin, FiDollarSign, FiHome, FiX } from 'react-icons/fi';

const PropertySearch = ({ onSearch, onFiltersChange, filters = {} }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    city: filters.city || '',
    property_type: filters.property_type || '',
    min_price: filters.min_price || '',
    max_price: filters.max_price || '',
    bedrooms: filters.bedrooms || '',
    bathrooms: filters.bathrooms || '',
    furnished: filters.furnished || false,
    parking_available: filters.parking_available || false,
    pet_policy: filters.pet_policy || '',
    ...filters
  });

  const propertyTypes = [
    'House', 'Apartment', 'Studio', 'Condo', 'Townhouse', 
    'Villa', 'Bungalow', 'Penthouse', 'Duplex', 'Other'
  ];

  const petPolicies = [
    'Allowed', 'Not Allowed', 'Case by Case', 'Dogs Only', 'Cats Only'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const searchFilters = {
      search: searchTerm,
      ...localFilters
    };
    onSearch(searchFilters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      city: '',
      property_type: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
      bathrooms: '',
      furnished: false,
      parking_available: false,
      pet_policy: ''
    };
    setSearchTerm('');
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== '' && value !== false
  ) || searchTerm !== '';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search properties by title, location, or description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <FiSettings className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </form>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMapPin className="inline w-4 h-4 mr-1" />
                City
              </label>
              <input
                type="text"
                value={localFilters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="e.g., Garissa"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiHome className="inline w-4 h-4 mr-1" />
                Property Type
              </label>
              <select
                value={localFilters.property_type}
                onChange={(e) => handleFilterChange('property_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiDollarSign className="inline w-4 h-4 mr-1" />
                Min Price (KSh)
              </label>
              <input
                type="number"
                value={localFilters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiDollarSign className="inline w-4 h-4 mr-1" />
                Max Price (KSh)
              </label>
              <input
                type="number"
                value={localFilters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                placeholder="100000"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Bedrooms & Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Bedrooms
              </label>
              <select
                value={localFilters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Bathrooms
              </label>
              <select
                value={localFilters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Pet Policy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Policy
              </label>
              <select
                value={localFilters.pet_policy}
                onChange={(e) => handleFilterChange('pet_policy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                {petPolicies.map(policy => (
                  <option key={policy} value={policy}>{policy}</option>
                ))}
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="furnished"
                  checked={localFilters.furnished}
                  onChange={(e) => handleFilterChange('furnished', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="furnished" className="ml-2 text-sm text-gray-700">
                  Furnished
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="parking"
                  checked={localFilters.parking_available}
                  onChange={(e) => handleFilterChange('parking_available', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="parking" className="ml-2 text-sm text-gray-700">
                  Parking Available
                </label>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              {hasActiveFilters && (
                <span>Active filters applied</span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center"
              >
                <FiX className="w-4 h-4 mr-1" />
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySearch;
