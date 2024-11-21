import { useEffect, useState } from 'react';
import { useTienda } from '../../../../context/TiendaContext';
import { ImagePlus, Store, X } from 'lucide-react';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';
import axios from '../../../../api/axios';

export default function StoreInfo() {
  const { tienda, getTienda } = useTienda();
  const [storeData, setStoreData] = useState({
    nombre: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    email: '',
    logo: '',
  });

  const [imagePreviewError, setImagePreviewError] = useState(false);
  const tiendaToken = Cookies.get('tiendaToken');
  const id = tienda ? tienda.id : null;

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!id) {
        console.error("No se encontró un ID de tienda válido.");
        return;
      }

      try {
        const store = await axios.get(`/tiendas/${id}`);
        setStoreData(store.data);
      } catch (error) {
        console.error("Error al cargar la tienda:", error);
      }
    };

    fetchStoreData();
  }, [id, getTienda]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData({
      ...storeData,
      [name]: value,
    });
    if (name === 'logo') {
      setImagePreviewError(false);
    }
  };

  const handleImageError = () => {
    setImagePreviewError(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tiendaId = storeData._id;
    
    if (!tiendaId) {
      alert('ID de la tienda no encontrado');
      return;
    }

    try {
      const updatedStoreData = await axios.put(`/tiendas/${tiendaId}`, storeData);
      console.log('Tienda actualizada:', updatedStoreData);
      alert('Datos de la tienda actualizados');
    } catch (error) {
      console.error('Error al actualizar la tienda:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Store className="w-6 h-6" />
            Configuración de la Tienda
          </h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Logo Preview Section */}
            <div className="relative bg-gray-50 p-8 flex flex-col items-center justify-center border-b">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                {storeData.logo && !imagePreviewError ? (
                  <img
                    src={storeData.logo}
                    alt="Logo de la tienda"
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Store className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              {imagePreviewError && (
                <p className="text-red-500 text-sm">Error al cargar la imagen. Verifica la URL.</p>
              )}
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo de la Tienda</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="logo"
                      value={storeData.logo}
                      onChange={handleChange}
                      placeholder="Ingresa la URL del logo"
                      className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {storeData.logo && (
                      <button
                        type="button"
                        onClick={() => setStoreData({ ...storeData, logo: '' })}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Tienda</label>
                  <input
                    type="text"
                    name="nombre"
                    value={storeData.nombre}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={storeData.telefono}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={storeData.email}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={storeData.direccion}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={storeData.descripcion}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-150 flex items-center gap-2"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}