import React, { useState, useEffect } from 'react';
import { FiHeart, FiMapPin, FiHome, FiUser, FiDroplet, FiInfo, FiPhone, FiMail, FiCalendar, FiDollarSign, FiCheck, FiX, FiStar } from 'react-icons/fi';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import ContactForm from './ContactForm';

const PropertyDetail = ({ propertyId, onClose, onFavoriteToggle }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/properties/${propertyId}`);
      setProperty(response.data);
    } catch (error) {
      toast.error('Failed to load property details');
      console.error('Error fetching property details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/properties/${propertyId}/favorite`);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/properties/${propertyId}/favorite`);
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(propertyId, !isFavorite);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update favorites');
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">Property not found</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleFavoriteToggle}
              className={`p-3 rounded-full transition-all duration-200 ${
                isFavorite 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <FiHeart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Image Gallery */}
          <div className="mb-8">
            {property.images && property.images.length > 0 ? (
              <div>
                <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <img
                    src={property.images[activeImageIndex]?.image_url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {property.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {property.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setActiveImageIndex(index)}
                        className={`h-20 rounded-lg overflow-hidden border-2 ${
                          index === activeImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.image_url}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏠</div>
                  <p className="text-gray-500">No images available</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Price and Basic Info */}
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(property.rent_amount)}
                    <span className="text-lg font-normal text-gray-600 ml-2">/month</span>
                  </div>
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {property.property_type}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.bedrooms && (
                    <div className="flex items-center text-gray-700">
                      <FiHome className="w-5 h-5 mr-2" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center text-gray-700">
                      <FiDroplet className="w-5 h-5 mr-2" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                  )}
                  {property.square_feet && (
                    <div className="flex items-center text-gray-700">
                      <FiInfo className="w-5 h-5 mr-2" />
                      <span>{property.square_feet} sq ft</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-700">
                    <FiMapPin className="w-5 h-5 mr-2" />
                    <span>{property.city}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Property Features */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Furnished: {property.furnished ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Parking: {property.parking_available ? 'Available' : 'Not Available'}</span>
                  </div>
                  {property.pet_policy && (
                    <div className="flex items-center">
                      <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Pet Policy: {property.pet_policy}</span>
                    </div>
                  )}
                  {property.smoking_policy && (
                    <div className="flex items-center">
                      <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Smoking: {property.smoking_policy}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <FiCheck className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <FiMapPin className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{property.address}</p>
                      <p className="text-gray-600">{property.city}</p>
                      {property.neighborhood && (
                        <p className="text-gray-600">{property.neighborhood}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Owner Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Owner</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {property.owner_name?.charAt(0) || 'O'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{property.owner_name}</p>
                    <p className="text-sm text-gray-500">Property Owner</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {property.contact_info?.phone && (
                    <a
                      href={`tel:${property.contact_info.phone}`}
                      className="flex items-center w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FiPhone className="w-5 h-5 mr-2" />
                      Call Owner
                    </a>
                  )}
                  {property.contact_info?.email && (
                    <a
                      href={`mailto:${property.contact_info.email}`}
                      className="flex items-center w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiMail className="w-5 h-5 mr-2" />
                      Email Owner
                    </a>
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Date:</span>
                    <span className="font-medium">{formatDate(property.available_date)}</span>
                  </div>
                  {property.lease_duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lease Duration:</span>
                      <span className="font-medium">{property.lease_duration}</span>
                    </div>
                  )}
                  {property.security_deposit && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Deposit:</span>
                      <span className="font-medium">{formatPrice(property.security_deposit)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium capitalize">{property.status}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowContactForm(true)}
                    className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Contact Owner
                  </button>
                  <button className="w-full p-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    Schedule Viewing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm
          property={property}
          onClose={() => setShowContactForm(false)}
          onSuccess={() => {
            setShowContactForm(false);
            toast.success('Contact request sent successfully!');
          }}
        />
      )}
    </div>
  );
};

export default PropertyDetail;
