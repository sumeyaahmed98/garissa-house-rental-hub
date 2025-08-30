import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiHome } from 'react-icons/fi';

const OwnerSignup = () => {
  const { ownerSignup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    location: '',
    propertyCount: '',
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await ownerSignup(form);
      toast.success('Account created successfully! Welcome to RentalHub!');
      navigate('/ownerdashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">List Your Properties</h1>
          <p className="text-gray-600 mt-2">Join property owners earning from their rentals in Garissa</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                name="name" 
                value={form.name} 
                onChange={onChange} 
                required 
                className="pl-10 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" 
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={onChange} 
                required 
                className="pl-10 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" 
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                name="phone" 
                type="tel" 
                value={form.phone} 
                onChange={onChange} 
                required 
                className="pl-10 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" 
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Location</label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                name="location" 
                value={form.location} 
                onChange={onChange} 
                required 
                className="pl-10 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" 
                placeholder="e.g., Garissa Town, Modogashe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Properties</label>
            <div className="relative">
              <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select 
                name="propertyCount" 
                value={form.propertyCount} 
                onChange={onChange} 
                required 
                className="pl-10 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select number of properties</option>
                <option value="1">1 Property</option>
                <option value="2-5">2-5 Properties</option>
                <option value="6-10">6-10 Properties</option>
                <option value="10+">10+ Properties</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={onChange} 
                required 
                className="pl-10 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" 
                placeholder="Create a password"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                name="confirmPassword" 
                type="password" 
                value={form.confirmPassword} 
                onChange={onChange} 
                required 
                className="pl-10 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" 
                placeholder="Confirm your password"
              />
            </div>
          </div>
          
          <button 
            disabled={loading} 
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md py-3 font-medium transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Join as Property Owner'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Looking to rent a property?{' '}
            <Link to="/tenant-signup" className="text-green-600 hover:underline font-medium">
              Find your home
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default OwnerSignup;
