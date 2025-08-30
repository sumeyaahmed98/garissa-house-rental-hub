import React, { useState } from 'react';
import { FiHome, FiMapPin, FiDollarSign, FiUser, FiPhone, FiMail } from 'react-icons/fi';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const PropertyForm = ({ onSuccess, initialData = null }) => {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    property_type: initialData?.property_type || '',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    square_feet: initialData?.square_feet || '',
    rent_amount: initialData?.rent_amount || '',
    security_deposit: initialData?.security_deposit || '',
    lease_duration: initialData?.lease_duration || '',
    available_date: initialData?.available_date || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    neighborhood: initialData?.neighborhood || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    furnished: initialData?.furnished || false,
    parking_available: initialData?.parking_available || false,
    pet_policy: initialData?.pet_policy || '',
    smoking_policy: initialData?.smoking_policy || '',
    amenities: initialData?.amenities || [],
    contact_info: initialData?.contact_info || {
      name: '',
      phone: '',
      email: '',
      preferred_contact: 'phone'
    }
  });

  const [loading, setLoading] = useState(false);

  const propertyTypes = [
    'House', 'Apartment', 'Studio', 'Condo', 'Townhouse', 
    'Villa', 'Bungalow', 'Penthouse', 'Duplex', 'Other'
  ];

  const leaseDurations = [
    '1 Month', '3 Months', '6 Months', '1 Year', '2 Years', 'Flexible'
  ];

  const petPolicies = [
    'Allowed', 'Not Allowed', 'Case by Case', 'Dogs Only', 'Cats Only'
  ];

  const smokingPolicies = [
    'Allowed', 'Not Allowed', 'Outdoor Only', 'Case by Case'
  ];

  const availableAmenities = [
    'Air Conditioning', 'Heating', 'Internet/WiFi', 'Cable TV', 'Dishwasher',
    'Washing Machine', 'Dryer', 'Gym', 'Pool', 'Garden', 'Balcony',
    'Elevator', 'Security System', 'Furnished', 'Kitchen', 'Bathroom',
    'Parking', 'Storage', 'Pet Friendly', 'Smoking Allowed'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContactInfoChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        [field]: value
      }
    }));
  };

  const handleAmenityChange = (amenity) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create property first
      const propertyData = {
        ...form,
        rent_amount: parseFloat(form.rent_amount),
        security_deposit: form.security_deposit ? parseFloat(form.security_deposit) : null,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        square_feet: form.square_feet ? parseInt(form.square_feet) : null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null
      };

      const propertyResponse = await api.post('/properties', propertyData);
      const propertyId = propertyResponse.data.property_id;

      toast.success('Property created successfully!');
      setForm({
        title: '', description: '', property_type: '', bedrooms: '', bathrooms: '',
        square_feet: '', rent_amount: '', security_deposit: '', lease_duration: '',
        available_date: '', address: '', city: '', neighborhood: '', latitude: '',
        longitude: '', furnished: false, parking_available: false, pet_policy: '',
        smoking_policy: '', amenities: [], contact_info: { name: '', phone: '', email: '', preferred_contact: 'phone' }
      });
      
      if (onSuccess) {
        onSuccess(propertyId);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Property</h2>
        <p className="text-gray-600">List your property and start earning from rentals</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FiHome className="mr-2" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Beautiful 3-Bedroom House in Garissa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                name="property_type"
                value={form.property_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Property Type</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={form.bedrooms}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={form.bathrooms}
                onChange={handleInputChange}
                min="0"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Feet
              </label>
              <input
                type="number"
                name="square_feet"
                value={form.square_feet}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Date
              </label>
              <input
                type="date"
                name="available_date"
                value={form.available_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your property, its features, and what makes it special..."
            />
          </div>
        </div>

        {/* Pricing & Terms */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FiDollarSign className="mr-2" />
            Pricing & Terms
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rent (KSh) *
              </label>
              <input
                type="number"
                name="rent_amount"
                value={form.rent_amount}
                onChange={handleInputChange}
                required
                min="0"
                step="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="25000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Deposit (KSh)
              </label>
              <input
                type="number"
                name="security_deposit"
                value={form.security_deposit}
                onChange={handleInputChange}
                min="0"
                step="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="25000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lease Duration
              </label>
              <select
                name="lease_duration"
                value={form.lease_duration}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Duration</option>
                {leaseDurations.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FiMapPin className="mr-2" />
            Location
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City/Town *
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Garissa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neighborhood
              </label>
              <input
                type="text"
                name="neighborhood"
                value={form.neighborhood}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Garissa Town, Modogashe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPS Coordinates (optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleInputChange}
                  step="any"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Latitude"
                />
                <input
                  type="number"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleInputChange}
                  step="any"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Longitude"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Features */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="furnished"
                checked={form.furnished}
                onChange={handleInputChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Furnished</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="parking_available"
                checked={form.parking_available}
                onChange={handleInputChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Parking Available</label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Policy
              </label>
              <select
                name="pet_policy"
                value={form.pet_policy}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Pet Policy</option>
                {petPolicies.map(policy => (
                  <option key={policy} value={policy}>{policy}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Smoking Policy
              </label>
              <select
                name="smoking_policy"
                value={form.smoking_policy}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Smoking Policy</option>
                {smokingPolicies.map(policy => (
                  <option key={policy} value={policy}>{policy}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableAmenities.map(amenity => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">{amenity}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FiUser className="mr-2" />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                value={form.contact_info.name}
                onChange={(e) => handleContactInfoChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.contact_info.phone}
                onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+254700000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={form.contact_info.email}
                onChange={(e) => handleContactInfoChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method
              </label>
              <select
                value={form.contact_info.preferred_contact}
                onChange={(e) => handleContactInfoChange('preferred_contact', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
        </div>



        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setForm({
                title: '', description: '', property_type: '', bedrooms: '', bathrooms: '',
                square_feet: '', rent_amount: '', security_deposit: '', lease_duration: '',
                available_date: '', address: '', city: '', neighborhood: '', latitude: '',
                longitude: '', furnished: false, parking_available: false, pet_policy: '',
                smoking_policy: '', amenities: [], contact_info: { name: '', phone: '', email: '', preferred_contact: 'phone' }
              });
              setImages([]);
              setUploadedImages([]);
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Property...' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
