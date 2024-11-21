// src/components/NavbarSuper.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '/src/assets/front/images/tecnoshopBlanco.png'; // Ruta absoluta para Vite

const NavbarSuper = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isSuperAdmin');
    navigate('/login-superadmin');
  };

  const handleViewStoresAndProducts = () => {
    navigate('/superadmin-stores-products');
  };

  const handleGoToDashboard = () => {
    navigate('/superadmin-dashboard');
  };

  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center fixed top-0 left-0 w-full z-10">
      <div className="flex items-center">
        <img src={logo} alt="TecnoShop Logo" className="h-10 mr-3" />
        <span className="font-semibold text-xl text-white">Panel SuperAdmin</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={handleGoToDashboard}
          className="bg-black hover:bg-gray-700 text-white font-bold py-1 px-4 rounded mr-4"
        >
          Ir al Dashboard
        </button>
        <button
          onClick={handleViewStoresAndProducts}
          className="bg-black hover:bg-gray-700 text-white font-bold py-1 px-4 rounded mr-4"
        >
          Ver Tiendas y Productos
        </button>
        <button
          onClick={handleLogout}
          className="bg-black hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default NavbarSuper;
