import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';
import { useProducts } from '../../../context/ProductContext';
import { Search, ShoppingCart, Star, Heart } from 'lucide-react';

const StorePage = () => {
  const location = useLocation();
  const [storeInfo, setStoreInfo] = useState(location.state?.tienda || {});
  const [storeId, setStoreId] = useState(location.state?.tienda?._id);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { getTienda, getProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');

  useEffect(() => {
    if (storeId) {
      const fetchStoreInfo = async () => {
        try {
          const response = await axios.get(`/tiendas/${storeId}`);
          console.log("Response data (store info):", response);
          setStoreInfo(response.data || {});
        } catch (error) {
          console.error("Error al cargar la información de la tienda:", error);
          setStoreInfo({});
        }
      };
      fetchStoreInfo();
    }
  }, [storeId, getTienda]);

  useEffect(() => {
    if (storeId) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`/tiendas/${storeId}/productos`);
          console.log("Response data (products):", response);
          setProducts(response.data || []);
        } catch (error) {
          console.error("Error al cargar los productos:", error);
          setProducts([]);
        }
      };
      fetchProducts();
    }
  }, [storeId]);

  const categories = [
    { id: 'todos', name: 'Todos los productos' },
    { id: 'tablets', name: 'Accesorios para Tablets' },
    { id: 'phones', name: 'Accesorios para Celulares' },
    { id: 'ofertas', name: 'Ofertas Especiales' }
  ];

  const handleFavorite = (id) => {
    console.log('Producto favorito:', id);
  };

  const handleViewDetailsClick = (product) => {
    navigate('/product-details', { state: { product } });
  };

  const ProductCard = ({ product }) => (
    <div 
      onClick={() => handleViewDetailsClick(product)}
      className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer relative"
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.imagenes[0]} 
          alt={product.nombre} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleFavorite(product._id);
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-all duration-200 transform hover:scale-110 z-10"
        >
          <Heart size={20} className="text-gray-500 hover:text-red-500 transition-colors duration-200" />
        </button>
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            -{product.discount}%
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm truncate">{product.descripcion}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors duration-200">
            {product.nombre}
          </h3>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600 font-medium">{product.valoraciones.promedio}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3 h-12 overflow-hidden">{product.descripcion}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">${product.precio}</span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.oldPrice}
              </span>
            )}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic here
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md flex items-center gap-2"
          >
            <ShoppingCart size={18} />
            <span>Agregar</span>
          </button>
        </div>
      </div>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-xl pointer-events-none transition-colors duration-300"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      <main className="flex-1">
        {/* Enhanced Header */}
        <div className="relative h-80 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_#fff_1px,_transparent_1px)] [background-size:32px_32px] animate-[grain_8s_steps(10)_infinite]"></div>
          </div>
          <div className="relative container mx-auto px-6 h-full flex items-center">
            <div className="text-white max-w-2xl animate-fadeIn">
              <h1 className="text-5xl font-bold mb-4 tracking-tight">
                {storeInfo.nombre}
              </h1>
              <p className="text-xl opacity-90 leading-relaxed">
                {storeInfo.descripcion || "Encuentra los mejores accesorios para tus dispositivos"}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar and Filters */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-lg z-20 transition-all duration-300">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-xl group">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 group-hover:bg-white"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" size={20} />
              </div>
              <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`whitespace-nowrap px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      activeCategory === category.id
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="container mx-auto px-6 py-8">
          {/* Store Info Card */}
          {storeInfo && (
            <div className="p-6 mb-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {storeInfo.logo && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg">
                    <img src={storeInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Información de la tienda</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <span className="text-blue-500">📞</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="font-medium">{storeInfo.telefono}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <span className="text-blue-500">📍</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ubicación</p>
                        <p className="font-medium">{storeInfo.direccion}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <span className="text-blue-500">📧</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Correo</p>
                        <p className="font-medium">{storeInfo.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Productos Disponibles</h2>
              <div className="text-sm text-gray-500">
                {products.length} productos encontrados
              </div>
            </div>

            {/* Enhanced Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Add these custom animations to your global CSS or Tailwind config
const styles = `
@keyframes grain {
  0%, 100% { transform: translate(0, 0) }
  10% { transform: translate(-5%, -5%) }
  20% { transform: translate(-10%, 5%) }
  30% { transform: translate(5%, -10%) }
  40% { transform: translate(-5%, 15%) }
  50% { transform: translate(-10%, 5%) }
  60% { transform: translate(15%, 0) }
  70% { transform: translate(0, 10%) }
  80% { transform: translate(-15%, 0) }
  90% { transform: translate(10%, 5%) }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
`;

export default StorePage;
