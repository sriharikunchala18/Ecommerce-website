import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart } from '../api';

export default function Cart({ user }){
  const [cart, setCart] = useState([]);

  useEffect(()=>{ loadCart(); }, [user]);

  async function loadCart(){
    if (user){
      const res = await getCart();
      setCart(res || []);
    } else {
      const guest = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCart(guest.map(g => ({ item: { _id: g.itemId, name: 'Item (guest)', price: 0 }, qty: g.qty })));
    }
  }

  async function handleRemove(itemId){
    if (user){
      const res = await removeFromCart(itemId);
      setCart(res || []);
    } else {
      const guest = JSON.parse(localStorage.getItem('guestCart') || '[]').filter(g => g.itemId !== itemId);
      localStorage.setItem('guestCart', JSON.stringify(guest));
      loadCart();
    }
  }

  const total = cart.reduce((s,c)=> s + (c.item?.price || 0) * c.qty, 0);

  return (
    <div>
      <h2 className="text-2xl mb-4">Your cart</h2>
      <div className="space-y-3">
        {cart.map(ci => (
          <div key={ci.item._id} className="flex items-center gap-4 bg-white p-4 rounded shadow">
            <div>
              <div className="font-semibold">{ci.item.name}</div>
              <div className="text-sm text-gray-500">Qty: {ci.qty}</div>
            </div>
            <div className="ml-auto">
              <div className="font-bold">₹ {ci.item.price ?? '-'}</div>
              <button onClick={()=>handleRemove(ci.item._id)} className="text-red-600 mt-2">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-xl">Total: ₹ {total}</div>
    </div>
  );
}
