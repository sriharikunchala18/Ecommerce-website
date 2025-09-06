import React from 'react';

export default function ItemCard({ item, onAdd }){
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
        <img src={item.images?.[0] || 'https://via.placeholder.com/300'} alt={item.name} className="max-h-full"/>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.category}</p>
        <p className="mt-2 font-bold">₹ {item.price}</p>
      </div>
      <button onClick={onAdd} className="mt-3 bg-indigo-600 text-white py-2 rounded">Add to cart</button>
    </div>
  );
}
