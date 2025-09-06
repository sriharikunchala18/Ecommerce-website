import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }){
  return (
    <nav className="bg-white p-4 rounded shadow flex items-center justify-between">
      <Link to="/" className="text-xl font-bold">GTG Shop</Link>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm">Shop</Link>
        <Link to="/cart" className="text-sm">Cart</Link>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">Hi, {user.name}</span>
            <button onClick={onLogout} className="text-sm text-red-600">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="text-sm">Login</Link>
        )}
      </div>
    </nav>
  );
}
