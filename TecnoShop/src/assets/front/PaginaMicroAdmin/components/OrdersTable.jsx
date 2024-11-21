import { useState, useEffect } from 'react';
import axios from '../../../../api/axios';
import Sidebar from './Sidebar';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedOrder, setEditedOrder] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Procesar cookies para obtener tiendaToken
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
          const [name, value] = cookie.split('=');
          acc[name] = value;
          return acc;
        }, {});

        const tiendaToken = cookies.tiendaToken;

        if (!tiendaToken) {
          console.error('No se encontró el tiendaToken.');
          setOrders([]);
          setFilteredOrders([]);
          return;
        }

        // Realizar la solicitud solo si tiendaToken está presente
        const response = await axios.get('/pedidos', { withCredentials: true });
        const fetchedOrders = Array.isArray(response.data.pedidos) ? response.data.pedidos : [];
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        setOrders([]);
        setFilteredOrders([]);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    setFilteredOrders(
      selectedFilter ? orders.filter((order) => order.status === selectedFilter) : orders
    );
  };

  const handleEditClick = (order) => {
    setEditingId(order.id);
    setEditedOrder({ ...order });
  };

  const handleSaveClick = (id) => {
    setOrders(orders.map((order) => (order.id === id ? editedOrder : order)));
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-5 w-full">
        <h2 className="text-2xl font-bold mb-5 text-center">Órdenes de Servicio</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="mb-4">
            <label htmlFor="filter" className="mr-2">Filtrar por estado:</label>
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="border border-gray-300 p-1 rounded"
            >
              <option value="">Todos</option>
              <option value="Completada">Completada</option>
              <option value="En proceso">En proceso</option>
            </select>
          </div>
          <table className="w-full table-auto">
            <thead className="bg-black text-white text-center">
              <tr>
                <th className="p-4 font-semibold text-sm">ID</th>
                <th className="p-4 font-semibold text-sm">Usuario</th>
                <th className="p-4 font-semibold text-sm">Envio</th>
                <th className="p-4 font-semibold text-sm">Fecha del Servicio</th>
                <th className="p-4 font-semibold text-sm">Estado</th>
                <th className="p-4 font-semibold text-sm">Total</th>
                <th className="p-4 font-semibold text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((pedido) => (
                <tr key={pedido._id} className="border-b border-gray-200 text-center hover:bg-gray-100">
                  <td className="p-4 text-gray-700 text-sm">{pedido._id}</td>
                  <td className="p-4 text-gray-700 text-sm">
                    {editingId === pedido._id? (
                      <input
                        type="text"
                        name="user"
                        value={editedOrder.user}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-1 rounded w-full"
                      />
                    ) : (
                      pedido.usuario.username
                    )}
                  </td>
                  <td className="p-4 text-gray-700 text-sm">
                    {editingId === pedido._id ? (
                      <input
                        type="text"
                        name="item"
                        value={editedOrder.item}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-1 rounded w-full"
                      />
                    ) : (
                      pedido.direccionEnvio
                    )}
                  </td>
                  <td className="p-4 text-gray-700 text-sm">
                    {editingId === pedido._id ? (
                      <input
                        type="date"
                        name="date"
                        value={editedOrder.date}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-1 rounded w-full"
                      />
                    ) : (
                      pedido.fechaCompra
                    )}
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {editingId === pedido._id ? (
                      <select
                        name="status"
                        value={editedOrder.status}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-1 rounded w-full"
                      >
                        <option value="Completada">Completada</option>
                        <option value="En proceso">En proceso</option>
                      </select>
                    ) : (
                      <span className={pedido.fechaCompra === 'Completada' ? 'text-green-500' : 'text-yellow-500'}>
                        {pedido.estado}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-700 text-sm">
                    {editingId === pedido.id ? (
                      <input
                        type="text"
                        name="total"
                        value={editedOrder.total}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-1 rounded w-full"
                      />
                    ) : (
                      pedido.totalCompra
                    )}
                  </td>
                  <td className="p-4 space-x-2">
                    {editingId === pedido.id ? (
                      <button
                        onClick={() => handleSaveClick(pedido._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(pedido)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                    )}
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
