import React, { useEffect, useState } from 'react';
import { fetchItems, addToCart } from '../api';
import ItemCard from '../components/ItemCard';

export default function Items({ user }){
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ q:'', minPrice:'', maxPrice:'', sort:'' });

  useEffect(()=>{ load(); }, []);

  async function load(){
    const res = await fetchItems({});
    setItems(res.items || []);
  }

  async function handleAdd(itemId){
    if (user){
      await addToCart(itemId, 1);
      alert('Added to cart');
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existing = guestCart.find(g=>g.itemId === itemId);
      if (existing) existing.qty++;
      else guestCart.push({ itemId, qty:1 });
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      alert('Added to cart (guest). It will be merged on login.');
    }
  }

  async function search(){
    const res = await fetchItems(filters);
    setItems(res.items || []);
  }

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input placeholder="Search" className="p-2 border rounded" value={filters.q} onChange={e=>setFilters({...filters, q:e.target.value})} />
        <input type="number" placeholder="Min price" className="p-2 border rounded" value={filters.minPrice} onChange={e=>setFilters({...filters, minPrice:e.target.value})} />
        <input type="number" placeholder="Max price" className="p-2 border rounded" value={filters.maxPrice} onChange={e=>setFilters({...filters, maxPrice:e.target.value})} />
        <select className="p-2 border rounded" value={filters.sort} onChange={e=>setFilters({...filters, sort:e.target.value})}>
          <option value="">Newest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
        <button onClick={search} className="bg-blue-600 text-white px-3 py-2 rounded">Apply</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(it=> <ItemCard key={it._id} item={it} onAdd={()=>handleAdd(it._id)} />)}
      </div>
    </div>
  );
}
