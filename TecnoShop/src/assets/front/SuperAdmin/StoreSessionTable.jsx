import React, { useEffect, useState } from 'react';

const StoreSessionTable = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // Simulación de datos de sesiones de tiendas
    const fetchedSessions = [
      { id: 1, storeName: 'Tienda1', user: 'UsuarioA', loginDate: '2023-11-01', loginTime: '10:00 AM' },
      { id: 2, storeName: 'Tienda2', user: 'UsuarioB', loginDate: '2023-11-02', loginTime: '11:30 AM' },
    ];
    setSessions(fetchedSessions);
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sesiones de Tiendas</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="px-6 py-3 text-left font-semibold">ID</th>
            <th className="px-6 py-3 text-left font-semibold">Nombre de la Tienda</th>
            <th className="px-6 py-3 text-left font-semibold">Usuario</th>
            <th className="px-6 py-3 text-left font-semibold">Fecha de Inicio de Sesión</th>
            <th className="px-6 py-3 text-left font-semibold">Hora de Inicio de Sesión</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {sessions.map((session, index) => (
            <tr key={session.id} className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
              <td className="px-6 py-4 whitespace-nowrap text-left">{session.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-left">{session.storeName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-left">{session.user}</td>
              <td className="px-6 py-4 whitespace-nowrap text-left">{session.loginDate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-left">{session.loginTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreSessionTable;
