import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changePassword(form);
      toast.success('Password updated');
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Change Password</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current password</label>
            <input name="currentPassword" type="password" value={form.currentPassword} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New password</label>
            <input name="newPassword" type="password" value={form.newPassword} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm new password</label>
            <input name="confirmNewPassword" type="password" value={form.confirmNewPassword} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </div>
          <button disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md py-2 transition">{loading ? 'Updating...' : 'Update password'}</button>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;


