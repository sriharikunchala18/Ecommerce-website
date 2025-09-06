import React, { useState } from 'react';
import { signup } from '../api';

export default function Signup({ onSignupSuccess }){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e){
    e.preventDefault();
    const resp = await signup({ name, email, password });
    if (resp?.token) onSignupSuccess(resp);
    else alert(resp?.message || 'Signup failed');
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Signup</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Signup</button>
      </form>
    </div>
  );
}
