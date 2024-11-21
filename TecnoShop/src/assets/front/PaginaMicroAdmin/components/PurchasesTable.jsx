// src/assets/front/PaginaMicroAdmin/components/PurchasesTable.jsx
import React from 'react';
import Sidebar from './Sidebar';

export default function PurchasesTable() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Compras Realizadas</h2>
        
        {/* Barra de búsqueda y botón para agregar una nueva compra */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Buscar compras"
            className="border border-gray-300 p-2 rounded-lg"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Nueva Compra
          </button>
        </div>

        {/* Tabla de compras */}
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2">ID</th>
              <th className="border border-gray-200 p-2">Cliente</th>
              <th className="border border-gray-200 p-2">Total</th>
              <th className="border border-gray-200 p-2">Fecha de Compra</th>
              <th className="border border-gray-200 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 p-2 text-center">1</td>
              <td className="border border-gray-200 p-2 text-center">Cliente A</td>
              <td className="border border-gray-200 p-2 text-center">$200.00</td>
              <td className="border border-gray-200 p-2 text-center">2024-09-23</td>
              <td className="border border-gray-200 p-2 text-center">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">Ver</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
            {/* Puedes agregar más filas de ejemplo aquí */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
