import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/tecnoshop.png'; // Asegúrate de que la ruta sea correcta

const Navbar = () => {
  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src={logo} alt="TecnoShop Logo" className="h-10 mr-3" />
        <span className="font-semibold text-xl text-white">TecnoShop</span> {/* Cambia el color aquí */}
      </div>
      <nav className="flex-grow flex justify-end">
        <ul className="flex space-x-4">
          <li>
            <Link to="/login" className="text-white hover:text-gray-900">
              
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;