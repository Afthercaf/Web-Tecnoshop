// src/components/SidebarSuper.jsx

import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const SidebarSuper = ({ setSelectedTable, isCollapsed, toggleSidebar }) => {
  return (
    <div
      className={`h-screen ${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-gray-900 text-white fixed top-16 left-0 flex flex-col justify-between transition-all duration-300 shadow-lg z-10`}
    >
      {/* Botón para colapsar el sidebar */}
      <button
        onClick={toggleSidebar}
        className="text-white p-2 focus:outline-none absolute top-4 right-4"
      >
        {isCollapsed ? <FaArrowRight size={20} /> : <FaArrowLeft size={20} />}
      </button>

      {/* Título del panel, visible solo si no está colapsado */}
      {!isCollapsed && (
        <div className="text-center py-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Panel de Gestión</h2>
        </div>
      )}

      {/* Menú de navegación */}
      <nav className="flex-1 mt-6 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setSelectedTable('users')}
              className={`w-full px-4 py-3 rounded-lg transition duration-200 flex items-center hover:bg-gray-800 ${
                isCollapsed ? 'justify-center' : 'text-lg font-medium'
              }`}
            >
              {!isCollapsed && 'Tabla de Usuarios Registrados'}
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedTable('stores')}
              className={`w-full px-4 py-3 rounded-lg transition duration-200 flex items-center hover:bg-gray-800 ${
                isCollapsed ? 'justify-center' : 'text-lg font-medium'
              }`}
            >
              {!isCollapsed && 'Tabla de Tiendas Inician Sesión'}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarSuper;
