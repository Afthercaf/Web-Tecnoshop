// src/components/SuperPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarSuper from './SidebarSuper';
import UserTable from './UserTable';
import StoreSessionTable from './StoreSessionTable';

const SuperPage = () => {
  const [selectedTable, setSelectedTable] = useState('users');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isSuperAdmin = localStorage.getItem('isSuperAdmin');
    if (!isSuperAdmin) {
      navigate('/login-superadmin');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex pt-16">
      {/* Sidebar para navegación entre tablas */}
      <SidebarSuper setSelectedTable={setSelectedTable} isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      {/* Área principal de contenido */}
      <div
        className={`flex-1 p-6 bg-gray-100 overflow-auto transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {selectedTable === 'users' ? (
          <UserTable /> 
        ) : (
          <StoreSessionTable />
        )}
      </div>
    </div>
  );
};

export default SuperPage;
