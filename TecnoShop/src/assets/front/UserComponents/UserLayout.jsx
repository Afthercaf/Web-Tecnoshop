import React, { useState } from 'react';
import UserHeader from './UserHeader';
import NavbarUser from './NavbarUser';
import UserSidebar from './UserSidebar';
import { Outlet, useLocation } from 'react-router-dom';

export default function UserLayout({ user, setUser, cartCount, onShowCart }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fijo a la izquierda */}
      <UserSidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Renderizar UserHeader solo en la página principal */}
        {location.pathname === '/' && (
          <UserHeader user={user} setUser={setUser} isSidebarCollapsed={isSidebarCollapsed} />
        )}

        {/* Renderizar NavbarUser en todas las demás páginas */}
        {location.pathname !== '/' && (
          <NavbarUser cartCount={cartCount} onShowCart={onShowCart} />
        )}

        {/* Contenido principal desplazable */}
        <main className="flex-1 bg-gray-100 p-8 overflow-auto mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
