import React, { useEffect, useState } from 'react';

const UserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simulación de datos para los usuarios registrados
    const fetchedUsers = [
      { id: 1, name: 'Usuario1', email: 'usuario1@example.com', registrationDate: '2023-11-01' },
      { id: 2, name: 'Usuario2', email: 'usuario2@example.com', registrationDate: '2023-11-02' },
    ];
    setUsers(fetchedUsers);
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Usuarios Registrados</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="px-6 py-3 text-left font-semibold">ID</th>
            <th className="px-6 py-3 text-left font-semibold">Nombre</th>
            <th className="px-6 py-3 text-left font-semibold">Email</th>
            <th className="px-6 py-3 text-left font-semibold">Fecha de Registro</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {users.map((user, index) => (
            <tr key={user.id} className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
              <td className="px-6 py-4 whitespace-nowrap text-left">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-left">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-left">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-left">{user.registrationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
