import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = useMemo(() => searchParams.get('email') || '', [searchParams]);
  const [form, setForm] = useState({ email: initialEmail, code: '', newPassword: '', confirmNewPassword: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(form);
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Reset Password</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">7-digit code</label>
            <input name="code" value={form.code} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New password</label>
            <input name="newPassword" type="password" value={form.newPassword} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm new password</label>
            <input name="confirmNewPassword" type="password" value={form.confirmNewPassword} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </div>
          <button disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md py-2 transition">{loading ? 'Resetting...' : 'Reset password'}</button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;


