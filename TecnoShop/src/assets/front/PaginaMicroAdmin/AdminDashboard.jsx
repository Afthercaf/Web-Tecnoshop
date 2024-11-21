import React from "react";
import { Navigate } from "react-router-dom"; // Importar Navigate para redirección
import Sidebar from "./components/Sidebar"; // Asegúrate de que la ruta sea correcta

const topProducts = [
  { name: "Auriculares Bluetooth", sales: 150 },
  { name: "Laptop Gamer", sales: 120 },
  { name: "Smartphone X", sales: 100 },
];

const rating = 4.5;
const reviews = [            
  { user: "Juan Pérez", comment: "Excelente calidad y entrega rápida.", rating: 5 },
  { user: "Ana García", comment: "El producto llegó en buenas condiciones.", rating: 4 },
  { user: "Carlos López", comment: "Buena relación calidad-precio.", rating: 4 },
];

export default function AdminDashboard() {
  // Ya no se requiere verificar el rol del usuario
  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar /> {/* Sidebar del vendedor */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Panel del Vendedor</h2>

        {/* Sección de Productos Más Vendidos */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Top Productos Vendidos</h3>
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6">
            <ul className="divide-y divide-gray-300">
              {topProducts.map((product, index) => (
                <li key={index} className="flex justify-between py-3">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{product.name}</span>
                  <span className="text-gray-600 dark:text-gray-400">Ventas: {product.sales}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sección de Puntuación */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Puntuación Promedio</h3>
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 flex items-center">
            <span className="text-5xl font-bold text-yellow-500 mr-4">{rating}</span>
            <span className="text-gray-600 dark:text-gray-400">Basado en {reviews.length} reseñas</span>
          </div>
        </section>

        {/* Sección de Reseñas */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Reseñas Recientes</h3>
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-lg">
                <p className="text-gray-800 dark:text-gray-200 font-medium">{review.user}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{review.comment}</p>
                <div className="text-yellow-500 text-sm">
                  {"★".repeat(review.rating)}{" "}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
