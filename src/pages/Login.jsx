import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success('Logged in successfully');
      
      // Redirect based on user type
      if (user.is_admin) {
        navigate('/admin/login');
      } else {
        navigate('/ownerdashboard');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" value={form.password} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </div>
          <button disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md py-2 transition">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot-password" className="text-teal-600 hover:underline">Forgot password?</Link>
          <Link to="/signup" className="text-teal-600 hover:underline">Create account</Link>
        </div>
      </div>
    </section>
  );
};

export default Login;


