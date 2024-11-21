import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function PurchasesManager() {
  const purchases = [
    { id: 1, buyer: 'Cliente 1', product: 'Producto A', date: '2024-09-10', total: '$300.00', details: 'Descripción detallada del Producto A. Características técnicas y especificaciones completas.' },
    { id: 2, buyer: 'Cliente 2', product: 'Producto B', date: '2024-09-12', total: '$150.00', details: 'Descripción detallada del Producto B. Características técnicas y especificaciones completas.' },
  ];

  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
  };

  const closeModal = () => {
    setSelectedPurchase(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-5 w-full">
        <h2 className="text-2xl font-bold mb-5 text-center">Compras Realizadas</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-black text-white text-center">
              <tr>
                <th className="p-4 font-semibold text-sm">ID</th>
                <th className="p-4 font-semibold text-sm">Comprador</th>
                <th className="p-4 font-semibold text-sm">Producto</th>
                <th className="p-4 font-semibold text-sm">Fecha de Compra</th>
                <th className="p-4 font-semibold text-sm">Total</th>
                <th className="p-4 font-semibold text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="border-b border-gray-200 text-center hover:bg-gray-100">
                  <td className="p-4 text-gray-700 text-sm">{purchase.id}</td>
                  <td className="p-4 text-gray-700 text-sm">{purchase.buyer}</td>
                  <td className="p-4 text-gray-700 text-sm">{purchase.product}</td>
                  <td className="p-4 text-gray-700 text-sm">{purchase.date}</td>
                  <td className="p-4 text-gray-700 text-sm">{purchase.total}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleViewDetails(purchase)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de detalles */}
        {selectedPurchase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-1/2 max-w-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Detalles del Producto</h3>
              <p><strong>Comprador:</strong> {selectedPurchase.buyer}</p>
              <p><strong>Producto:</strong> {selectedPurchase.product}</p>
              <p><strong>Fecha de Compra:</strong> {selectedPurchase.date}</p>
              <p><strong>Total:</strong> {selectedPurchase.total}</p>
              <p className="mt-4"><strong>Descripción:</strong> {selectedPurchase.details}</p>
              <button
                onClick={closeModal}
                className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
