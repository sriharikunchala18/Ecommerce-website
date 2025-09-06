import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Items from './pages/Items';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';

export default function App(){
  const [user, setUser] = useState(()=>{
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const navigate = useNavigate();

  useEffect(()=>{
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  function logout(){
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }

  async function handleLoginResponse(resp){
    if (resp?.token){
      localStorage.setItem('token', resp.token);
      setUser(resp.user);
      // merge guest cart
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      if (guestCart.length > 0){
        try {
          await fetch(import.meta.env.VITE_API_BASE + '/cart/merge', {
            method: 'POST',
            headers: { 'Content-Type':'application/json', Authorization: `Bearer ${resp.token}` },
            body: JSON.stringify({ guestCart })
          });
          localStorage.removeItem('guestCart');
        } catch(e){ console.error(e); }
      }
      navigate('/');
    } else {
      alert(resp?.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Navbar user={user} onLogout={logout} />
      <main className="container mx-auto mt-6">
        <Routes>
          <Route path="/" element={<Items user={user} />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginResponse} />} />
          <Route path="/signup" element={<Signup onSignupSuccess={handleLoginResponse} />} />
          <Route path="/cart" element={<Cart user={user} />} />
        </Routes>
      </main>
    </div>
  );
}
