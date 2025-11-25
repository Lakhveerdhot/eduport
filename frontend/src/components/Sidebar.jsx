import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ links = [] }){
  return (
    <aside className="w-64 bg-white border-r p-6 hidden md:block sticky top-6 h-[calc(100vh-96px)]">
      <div className="text-sm text-gray-600 mb-4">Menu</div>
      <ul className="space-y-3">
        {links.map(l => (
          <li key={l.to}>
            <Link to={l.to} className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-700 hover:text-indigo-600">{l.label}</Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-xs text-gray-400">Eduport · Demo</div>
    </aside>
  );
}
