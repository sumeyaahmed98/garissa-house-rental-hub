import React, { useState } from 'react';
import { FiHeart, FiMapPin, FiHome, FiUser, FiDroplet, FiInfo, FiStar, FiPhone, FiMail } from 'react-icons/fi';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, onFavoriteToggle, onViewDetails, onContactOwner, showFavoriteButton = true }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFavoriteToggle = async () => {
    if (!showFavoriteButton) return;

    setLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/properties/${property.id}/favorite`);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/properties/${property.id}/favorite`);
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(property.id, !isFavorite);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'house':
        return '🏠';
      case 'apartment':
        return '🏢';
      case 'studio':
        return '🏠';
      case 'condo':
        return '🏢';
      case 'townhouse':
        return '🏘️';
      case 'villa':
        return '🏡';
      case 'bungalow':
        return '🏠';
      case 'penthouse':
        return '🏢';
      default:
        return '🏠';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200">
        {property.primary_image ? (
          <img
            src={property.primary_image}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <div className="text-4xl mb-2">{getPropertyTypeIcon(property.property_type)}</div>
              <p className="text-gray-500 text-sm">No Image Available</p>
            </div>
          </div>
        )}

        {/* Favorite Button */}
        {showFavoriteButton && (
          <button
            onClick={handleFavoriteToggle}
            disabled={loading}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${isFavorite
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
          >
            <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          {property.property_type}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          {formatPrice(property.rent_amount)}
          <span className="text-xs font-normal ml-1">/month</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <FiMapPin className="w-4 h-4 mr-1" />
            <span>{property.address}, {property.city}</span>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {property.bedrooms && (
            <div className="flex items-center text-gray-600">
              <FiHome className="w-4 h-4 mr-2" />
              <span className="text-sm">{property.bedrooms} bed</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center text-gray-600">
              <FiDroplet className="w-4 h-4 mr-2" />
              <span className="text-sm">{property.bathrooms} bath</span>
            </div>
          )}
          {property.square_feet && (
            <div className="flex items-center text-gray-600">
              <FiInfo className="w-4 h-4 mr-2" />
              <span className="text-sm">{property.square_feet} sq ft</span>
            </div>
          )}
        </div>

        {/* Amenities Preview */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Owner Info */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">
                  {property.owner_name?.charAt(0) || 'O'}
                </span>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">{property.owner_name}</p>
                <p className="text-xs text-gray-500">Property Owner</p>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex space-x-2">
              {property.contact_info?.phone && (
                <a
                  href={`tel:${property.contact_info.phone}`}
                  className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                  title="Call Owner"
                >
                  <FiPhone className="w-4 h-4" />
                </a>
              )}
              {property.contact_info?.email && (
                <a
                  href={`mailto:${property.contact_info.email}`}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                  title="Email Owner"
                >
                  <FiMail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => onViewDetails && onViewDetails(property.id)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => onContactOwner && onContactOwner(property)}
            className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
