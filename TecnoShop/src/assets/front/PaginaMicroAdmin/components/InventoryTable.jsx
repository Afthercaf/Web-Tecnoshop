import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function InventoryTable() {
  const initialInventory = [
    { id: 1, name: 'Pieza A', quantity: 50, price: 10.0, supplier: 'Proveedor XYZ', category: 'Electrónica' },
    { id: 2, name: 'Pieza B', quantity: 30, price: 15.0, supplier: 'Proveedor ABC', category: 'Repuestos' },
  ];

  const [inventory, setInventory] = useState(initialInventory);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product });
  };

  const handleSaveClick = (id) => {
    setInventory(
      inventory.map((item) =>
        item.id === id ? editedProduct : item
      )
    );
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Inventario</h2>

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Buscar en el inventario"
            className="border border-gray-300 p-2 rounded-lg"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Agregar Nuevo
          </button>
        </div>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2 bg-black text-white">ID</th>
              <th className="border border-gray-200 p-2 bg-black text-white">Nombre</th>
              <th className="border border-gray-200 p-2 bg-black text-white">Cantidad</th>
              <th className="border border-gray-200 p-2 bg-black text-white">Precio por Unidad</th>
              <th className="border border-gray-200 p-2 bg-black text-white">Proveedor</th>
              <th className="border border-gray-200 p-2 bg-black text-white">Categoría</th>
              <th className="border border-gray-200 p-2 bg-black text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 text-center">
                <td className="p-2">{product.id}</td>
                <td className="p-2">
                  {editingId === product.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editedProduct.name}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="p-2">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      name="quantity"
                      value={editedProduct.quantity}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  ) : (
                    product.quantity
                  )}
                </td>
                <td className="p-2">
                  {editingId === product.id ? (
                    <input
                      type="number"
                      name="price"
                      value={editedProduct.price}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </td>
                <td className="p-2">
                  {editingId === product.id ? (
                    <input
                      type="text"
                      name="supplier"
                      value={editedProduct.supplier}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  ) : (
                    product.supplier
                  )}
                </td>
                <td className="p-2">
                  {editingId === product.id ? (
                    <input
                      type="text"
                      name="category"
                      value={editedProduct.category}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  ) : (
                    product.category
                  )}
                </td>
                <td className="p-2">
                  {editingId === product.id ? (
                    <button
                      onClick={() => handleSaveClick(product.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(product)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                  )}
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
