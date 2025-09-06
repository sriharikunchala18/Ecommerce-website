import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLoginSuccess }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    const resp = await login({ email, password });
    if (resp?.token){
      onLoginSuccess(resp);
    } else {
      alert(resp?.message || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
          <button type="button" onClick={()=>navigate('/signup')} className="px-4 py-2 border rounded">Signup</button>
        </div>
      </form>
    </div>
  );
}
