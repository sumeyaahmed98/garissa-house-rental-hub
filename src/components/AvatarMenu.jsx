import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AvatarMenu = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = user.name?.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase() || 'U';

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold">
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border p-2 z-50">
          <div className="px-3 py-2">
            <div className="text-sm font-semibold">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
          <div className="border-t my-2" />
          <Link to="/change-password" className="block px-3 py-2 text-sm hover:bg-gray-50 rounded">Change password</Link>
          <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">Logout</button>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;


