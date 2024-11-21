import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaClipboardList, FaShoppingCart, FaCog, FaSignOutAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuthUser } from '../../../context/authContext';
import { useTienda } from '../../../context/TiendaContext';
import { ButtonLink } from '../ui/ButtonLink';
import { Button } from '../ui/Button';

const UserSidebar = ({ isCollapsed, toggleSidebar, profileImage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated: isUserAuthenticated, logout, user } = useAuthUser();
  const { isAuthenticated: isVendorAuthenticated, isStoreVerified } = useTienda();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLoginReminder, setShowLoginReminder] = useState(false);
  const autoCloseTimerRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleSellProductsClick = () => {
    navigate('/login-vendor');
  };

  // Auto-close functionality for modal
  useEffect(() => {
    if (showAuthModal) {
      const startTimer = () => {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = setTimeout(() => {
          setShowAuthModal(false);
        }, 5000);
      };

      startTimer();

      const handleUserActivity = () => startTimer();
      const modalElement = document.querySelector('[role="dialog"]');
      
      if (modalElement) {
        modalElement.addEventListener('mousemove', handleUserActivity);
        modalElement.addEventListener('click', handleUserActivity);
      }

      return () => {
        clearTimeout(autoCloseTimerRef.current);
        if (modalElement) {
          modalElement.removeEventListener('mousemove', handleUserActivity);
          modalElement.removeEventListener('click', handleUserActivity);
        }
      };
    }
  }, [showAuthModal]);

  return (
    <div 
      className={`h-screen ${isCollapsed ? 'w-20' : 'w-64'} bg-gray-900 text-white fixed flex flex-col justify-between transition-all duration-300 shadow-lg`}
    >
      {/* Sidebar Toggle Button */}
      <button onClick={toggleSidebar} className="text-white p-2 focus:outline-none absolute top-4 right-4 hover:bg-gray-800 rounded-full transition-colors">
        {isCollapsed ? <FaArrowRight size={20} /> : <FaArrowLeft size={20} />}
      </button>

      {/* Profile Information */}
      {!isCollapsed && (
        <div className="text-center py-6 border-b border-gray-700 tracking-wide">
          <div className="flex flex-col items-center">
            <img src={profileImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv5ulumXxZdrcBKSu7AUfL2AfDlIs1fRSEFA&s'} alt="Perfil" className="w-16 h-16 rounded-full mb-2" />
            <span className="text-lg font-semibold">{user?.username || 'Usuario'}</span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 mt-6 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <button onClick={() => navigate('/')} className={`px-4 py-3 rounded-lg transition duration-200 flex items-center ${isActive('/') ? 'bg-gray-800 text-white font-bold shadow-inner' : 'hover:bg-gray-800'}`}>
              <FaHome className="mr-3 text-lg" />
              {!isCollapsed && <span className="text-lg font-medium">Inicio</span>}
            </button>
          </li>

          {isUserAuthenticated && (
            <>
              <li>
                <button onClick={() => navigate('/user-profile')} className={`px-4 py-3 rounded-lg transition duration-200 flex items-center ${isActive('/user-profile') ? 'bg-gray-800 text-white font-bold shadow-inner' : 'hover:bg-gray-800'}`}>
                  <FaUser className="mr-3 text-lg" />
                  {!isCollapsed && <span className="text-lg font-medium">Mi Perfil</span>}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/user-orders')} className={`px-4 py-3 rounded-lg transition duration-200 flex items-center ${isActive('/user-orders') ? 'bg-gray-800 text-white font-bold shadow-inner' : 'hover:bg-gray-800'}`}>
                  <FaClipboardList className="mr-3 text-lg" />
                  {!isCollapsed && <span className="text-lg font-medium">Mis Pedidos</span>}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cart')} className={`px-4 py-3 rounded-lg transition duration-200 flex items-center ${isActive('/cart') ? 'bg-gray-800 text-white font-bold shadow-inner' : 'hover:bg-gray-800'}`}>
                  <FaShoppingCart className="mr-3 text-lg" />
                  {!isCollapsed && <span className="text-lg font-medium">Carrito</span>}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/user-settings')} className={`px-4 py-3 rounded-lg transition duration-200 flex items-center ${isActive('/user-settings') ? 'bg-gray-800 text-white font-bold shadow-inner' : 'hover:bg-gray-800'}`}>
                  <FaCog className="mr-3 text-lg" />
                  {!isCollapsed && <span className="text-lg font-medium">Configuración</span>}
                </button>
              </li>
              <li>
                <button 
                  onClick={handleSellProductsClick} 
                  className="w-full px-4 py-3 rounded-lg transition duration-200 flex items-center hover:bg-gray-800"
                >
                  <FaClipboardList className="mr-3 text-lg" />
                  {!isCollapsed && <span className="text-lg font-medium">Vender mis productos</span>}
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Auth Links and Logout Button */}
      <div className="px-4 py-3 border-t border-gray-700">
        {isUserAuthenticated ? (
          <Button onClick={() => logout()} className="w-full text-left hover:bg-gray-800 rounded-lg flex items-center text-lg font-medium transition duration-200 py-2 px-4">
            <FaSignOutAlt className="mr-3 text-lg" />
            <span className="flex-1">{!isCollapsed && 'Cerrar Sesión'}</span>
          </Button>
        ) : (
          <div className="flex flex-col gap-y-2">
            <ButtonLink to="/LoginUsuarios" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center">
              <span className="flex-1">{isCollapsed ? 'Login' : 'Iniciar Sesión'}</span>
            </ButtonLink>
            <ButtonLink to="/registro" className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center">
              <span className="flex-1">{isCollapsed ? 'Reg' : 'Registrarse'}</span>
            </ButtonLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSidebar;