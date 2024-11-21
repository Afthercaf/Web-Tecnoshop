import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaMobileAlt, FaLaptop, FaHeadphones, FaTv, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useProducts } from "../../../context/ProductContext";

const staticOffers = [
  {
    name: 'Monitor portátil HDR',
    category: 'Monitores',
    description: 'Ideal para trabajo y entretenimiento, con opciones de conectividad versátiles.',
    discount: '20% OFF',
    price: '$2,490',
    image: '/src/assets/front/images/monitor.png',
    storeLogo: '/src/assets/front/images/bitplus.png',
    promoEndDate: '30 de noviembre, 2024',
    storeName: 'Bitplus',
    storeDescription: '¿Tecnología? Lo tenemos en Bitplus',
    storeSpecialty: 'Expertos en equipos de cómputo, audio, y conectividad',
  },
  {
    name: 'Laptop Gamer',
    category: 'Computadora',
    description: 'Máximo rendimiento para juegos y tareas intensivas.',
    discount: '15% OFF',
    price: '$15,000',
    image: '/src/assets/front/images/laptop.png',
    storeLogo: '/src/assets/front/images/mg_accesorios.png',
    promoEndDate: '30 de noviembre, 2024',
    storeName: 'MG Accesorios',
    storeDescription: 'Todo en tecnología y más',
    storeSpecialty: 'Especialistas en accesorios de calidad para tus dispositivos',
  },
];

const categories = [
  { name: 'Celular', icon: <FaMobileAlt />, filter: 'Celular' },
  { name: 'Computadora', icon: <FaLaptop />, filter: 'Computadora' },
  { name: 'Audífonos', icon: <FaHeadphones />, filter: 'Audífonos' },
  { name: 'Monitores', icon: <FaTv />, filter: 'Monitores' },
];

const UserPage = () => {
  const navigate = useNavigate();
  const { products, getProducts } = useProducts();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const nextProduct = () => {
    setIsSliding(true);
    setCurrentProductIndex((prevIndex) => (prevIndex + 1) % staticOffers.length);
    setTimeout(() => setIsSliding(false), 500);
  };

  const prevProduct = () => {
    setIsSliding(true);
    setCurrentProductIndex((prevIndex) => (prevIndex - 1 + staticOffers.length) % staticOffers.length);
    setTimeout(() => setIsSliding(false), 500);
  };

  const handleViewDetailsClick = (product) => {
    navigate('/product-details', { state: { product } });
  };

  const handleCategoryClick = (filter) => {
    setSelectedCategory(filter);
    const filtered = products.filter((product) => product.categoria === filter);
    setFilteredProducts(filtered);
  };

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-500" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-500" />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Carrusel de Ofertas Mejorado */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-2xl shadow-2xl relative w-full max-w-5xl flex flex-col h-auto mb-12 overflow-hidden">
        <button 
          onClick={prevProduct} 
          className="absolute top-1/2 left-4 p-3 bg-black/50 backdrop-blur-sm text-white rounded-full 
                   hover:bg-black hover:scale-110 transition-all duration-300 transform -translate-y-1/2 z-10"
        >
          <FaArrowLeft size={28} />
        </button>

        <div 
          className={`flex items-center mb-8 cursor-pointer transform transition-transform duration-500 
                     ${isSliding ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}
          onClick={() => handleViewDetailsClick(staticOffers[currentProductIndex])}
        >
          <img 
            src={staticOffers[currentProductIndex].image} 
            alt={staticOffers[currentProductIndex].name} 
            className="w-60 h-60 object-contain mr-8 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <div className="flex flex-col justify-center mr-8">
            <div className="inline-block bg-red-500 px-4 py-1 rounded-full mb-3 transform hover:scale-105 transition-transform">
              <h4 className="text-6xl font-extrabold">{staticOffers[currentProductIndex].discount}</h4>
            </div>
            <p className="text-2xl font-semibold text-gray-100 mb-2">{staticOffers[currentProductIndex].name}</p>
            <p className="text-lg font-light mb-3 text-gray-200">{staticOffers[currentProductIndex].description}</p>
            <p className="text-3xl font-semibold text-yellow-300 mb-3 hover:text-yellow-400 transition-colors">
              {staticOffers[currentProductIndex].price}
            </p>
            <p className="text-sm text-gray-200 mb-5">
              Promoción válida hasta el {staticOffers[currentProductIndex].promoEndDate}
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg text-blue-800 flex items-center justify-between w-full transform hover:scale-102 transition-transform">
          <img 
            src={staticOffers[currentProductIndex].storeLogo} 
            alt={`${staticOffers[currentProductIndex].storeName} Logo`} 
            className="w-20 h-auto mr-4"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{staticOffers[currentProductIndex].storeDescription}</h3>
            <p className="text-base text-blue-600">{staticOffers[currentProductIndex].storeSpecialty}</p>
          </div>
        </div>

        <button 
          onClick={nextProduct} 
          className="absolute top-1/2 right-4 p-3 bg-black/50 backdrop-blur-sm text-white rounded-full 
                   hover:bg-black hover:scale-110 transition-all duration-300 transform -translate-y-1/2 z-10"
        >
          <FaArrowRight size={28} />
        </button>
      </section>
      
      {/* Categorías Mejoradas */}
      <div className="mb-12 w-full max-w-5xl">
        <div className="flex justify-around items-center bg-white rounded-xl shadow-lg p-6">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.filter)}
              className={`flex flex-col items-center cursor-pointer p-4 rounded-lg transition-all duration-300
                         ${selectedCategory === category.filter 
                           ? 'bg-blue-100 text-blue-600 scale-110' 
                           : 'hover:bg-gray-100 hover:scale-105'}`}
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <p className="text-sm font-semibold">{category.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Productos Mejorados */}
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Productos Disponibles en estas Tiendas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              onClick={() => handleViewDetailsClick(product)}
              className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer 
                        hover:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-2"
            >
              <div className="relative p-4">
                <img 
                  src={product.imagenes[0]} 
                  alt={product.nombre} 
                  className="w-full h-48 object-contain mb-4 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                  {product.categoria}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100">
                <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                  {product.nombre}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  ${product.precio}
                </p>
                <div className="mt-2">{renderRating(product.valoraciones.promedio || 4.5)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;