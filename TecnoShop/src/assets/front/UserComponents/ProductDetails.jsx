import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useAuthUser } from '../../../context/authContext';
import { useUsers } from '../../../context/UserContext';
import { useCart } from './CartPage';
import { useProducts } from '../../../context/ProductContext';
import axios from "../../../api/axios";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthUser();
  const { getUser } = useUsers();
  const { addToCart } = useCart();
  const { getTienda } = useProducts();
  const [tienda, setTienda] = useState(null);

  const product = location.state?.product;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [deliveryDay, setDeliveryDay] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta de Crédito');

  useEffect(() => {
    if (!product) {
      navigate('/'); // Redirige al usuario a la página principal si no hay un producto
    }
  }, [product, navigate]);

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.id) {
        try {
          const userData = await getUser(user.id);
          if (userData) setAddress(userData.address || '');
        } catch (error) {
          console.error("Error al cargar el usuario:", error);
        }
      }
    };
    fetchUserData();
  }, [user, getUser]);

  useEffect(() => {
    if (product && product.tiendaId) {
      const fetchTienda = async () => {
        try {
          const tiendaData = await getTienda(product.tiendaId); // Asegúrate de que `getTienda` devuelva la tienda completa
          setTienda(tiendaData); // Guarda la tienda completa en el estado
          console.log(tiendaData)
        } catch (error) {
          console.error("Error al cargar la tienda:", error);
        }
      };
      fetchTienda();
    }
  }, [product]);
  // Generar fecha de entrega aleatoria
  useEffect(() => {
    const generateRandomDeliveryDate = () => {
      const today = new Date();
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + 1);
      const maxDate = new Date(today);
      maxDate.setDate(today.getDate() + 14);
      const randomDate = new Date(minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime()));
      setDeliveryDay(randomDate.toLocaleDateString());
    };
    generateRandomDeliveryDate();
  }, []);

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, index) => (
        <FaStar key={`full-${index}`} className="text-yellow-500 text-lg" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-500 text-lg" />}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <FaRegStar key={`empty-${index}`} className="text-yellow-500 text-lg" />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};


  const handleAddToCart = () => {
    if (quantity > product.cantidad) {
      alert('No hay suficiente stock para esta cantidad');
      return;
    }
    addToCart(product, quantity);  // Pasando `product` y `quantity` por separado
    alert('Producto agregado al carrito');
  };
  
  
  // Use handleAddToCart as a separate "Add to Cart" button or in handleBuyNow
  const handleBuyNow = () => {  // Add the product to the cart when buying
    setShowPurchaseModal(true);  // Proceed to show the purchase modal
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleViewStore = (storeInfo) => {
    navigate('/user-compra', { state: { tienda: storeInfo } });
  };
  

  const handleAddComment = () => {
    if (newComment && newRating > 0) {
      setComments([...comments, { text: newComment, rating: newRating }]);
      setNewComment('');
      setNewRating(0);
    }
  };

  const renderProductSpecifications = () => {
    return product.especificaciones.map((spec, index) => (
      <div key={index} className="p-4 rounded-lg shadow-md bg-gray-50 mb-4">
        <h3 className="text-lg font-semibold text-black">{spec.titulo}</h3>
        <p className="text-sm text-gray-600">{spec.descripcion}</p>
      </div>
    ));
  };

  const handleConfirmPurchase = async () => {
    try {
      const pedidoData = {
        productos: [
          {
            productoId: product._id,
            cantidad: quantity,
          }
        ],
        metodoPago: paymentMethod,
      };
  
      // Realizar la petición al servidor
      const response = await axios.post('/pedidos', pedidoData, {
        withCredentials: true, // Enviar cookies, como el token, si es necesario
      });
  
      // Manejar la respuesta del servidor
      if (response.data.compra) {
        alert('Compra confirmada. ID del pedido: ' + response.data.compra._id);
      } else {
        alert('Error al confirmar la compra.');
      }
    } catch (error) {
      console.error("Error al confirmar la compra:", error);
      alert('Ocurrió un error al confirmar la compra.');
    } finally {
      setShowPurchaseModal(false);
    }
  }  




  const handleNextStep = () => setStep((prevStep) => prevStep + 1);
  const handlePreviousStep = () => setStep((prevStep) => prevStep - 1);
  const handleCloseModal = () => setShowPurchaseModal(false);

  const PurchaseModal = ({}) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Detalles de compra</h2>
          <button onClick={() => setShowPurchaseModal(false)} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de entrega</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ingresa tu dirección"
              />
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-800">
                <span className="font-semibold">Fecha de entrega estimada:</span> {deliveryDay}
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Producto:</span> {product.nombre}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Dirección:</span> {address}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Método de pago:</span> {paymentMethod}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirmar compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Image Section */}
            <div className="space-y-6">
              <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-xl overflow-hidden">
                <img src={product.imagenes} alt={product.nombre} className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center justify-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Cantidad</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button onClick={decreaseQuantity} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">−</button>
                  <span className="px-6 py-2 text-center">{quantity}</span>
                  <button onClick={increaseQuantity} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">+</button>
                </div>
              </div>
            </div>


            {/* Product Info Section */}
            <div className="flex flex-col">
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.nombre}</h1>
                  <div className="mt-2 flex items-center space-x-4">
                    {renderRating(product.rating || 4)}
                    <span className="text-sm text-gray-500">|</span>
                    <span className="text-sm text-gray-500">+1,000 vendidos</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.precio.toLocaleString()}
                  </span>
                  <p className="text-sm text-gray-500">IVA incluido</p>
                </div>

                <p className="text-gray-700">{product.description}</p>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">
                    Vendido por: {tienda?.nombre || "Nombre de tienda no disponible"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
              <button
  onClick={handleBuyNow}
  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
>
  Comprar ahora
</button>
<button
  onClick={handleAddToCart}
  className="w-full bg-white text-blue-600 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
>
  Agregar al carrito
</button>
<button
  onClick={() => handleViewStore(tienda)}
  className="w-full bg-blue-100 text-blue-700 py-3 rounded-lg hover:bg-blue-200 transition-colors"
>
  Ver tienda
</button>

              </div>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="border-t border-gray-200 px-6 py-8 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Especificaciones del producto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.especificaciones.map((spec, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{spec.titulo}</h3>
                  <p className="text-gray-700 text-sm">{spec.descripcion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 px-6 py-8 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Opiniones</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Deja tu opinión
                </h3>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="¿Qué te pareció este producto?"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="4"
                />
                <div className="mt-4 flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Tu calificación:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1"
                      >
                        <FaStar
                          className={`text-xl ${
                            newRating >= star ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAddComment}
                  className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Publicar opinión
                </button>
              </div>

              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      {renderRating(comment.rating)}
                      <p className="mt-2 text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Sé el primero en dejar una opinión sobre este producto
                </p>
              )}
            </div>
          </div>
        </div>
        </div>
      {showPurchaseModal && <PurchaseModal />}
    </div>
  );
};
export default ProductDetails;
