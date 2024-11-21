// src/assets/front/PaginaMicroAdmin/components/CategoryManager.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function CategoryManager() {
  const [categories, setCategories] = useState([
    // Ejemplo de categorías preexistentes
    { id: 1, name: 'Tecnología' },
    { id: 2, name: 'Electrodomésticos' },
  ]);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() === '') return;

    const newCategoryObj = {
      id: categories.length + 1,
      name: newCategory,
    };
    setCategories([...categories, newCategoryObj]);
    setNewCategory('');
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Gestión de Categorías</h2>

        <form onSubmit={handleAddCategory} className="mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nueva categoría"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-150"
            >
              Añadir
            </button>
          </div>
        </form>

        <div>
          <h3 className="text-xl font-semibold mb-4">Categorías existentes</h3>
          <ul className="space-y-3">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
              >
                <span>{category.name}</span>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
