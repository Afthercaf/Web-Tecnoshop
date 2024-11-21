import { useState, useEffect, createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaGift, FaTruck } from 'react-icons/fa';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = Cookies.get('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [totalItems, setTotalItems] = useState(() => {
    const storedCart = Cookies.get('cart');
    return storedCart ? JSON.parse(storedCart).reduce((acc, item) => acc + item.quantity, 0) : 0;
  });

  useEffect(() => {
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
    setTotalItems(cart.reduce((acc, item) => acc + item.quantity, 0));
  }, [cart]);

  const addToCart = (product, quantity = 1) => { // Valor por defecto para evitar null
    setCart((prevCart) => {
      const existingProduct = prevCart.find((prod) => prod.id === product.id);
      const updatedCart = existingProduct
        ? prevCart.map((prod) =>
            prod.id === product.id
              ? { ...prod, quantity: (prod.quantity || 0) + quantity } // Asegura que no sea null
              : prod
          )
        : [...prevCart, { ...product, quantity }];
      setTotalItems(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
      return updatedCart;
    });
  };
  
  
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) => {
      const updatedCart = prevCart.map((prod) =>
        prod.id === productId ? { ...prod, quantity } : prod
      );
      setTotalItems(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
      return updatedCart;
    });
  };
  
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((prod) => prod.id !== productId);
      setTotalItems(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart, totalItems } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const total = cart.reduce(
    (sum, product) => sum + (parseFloat(product.precio) || 0) * (product.quantity || 0),
    0
  );

  const handleApplyDiscount = () => {
    setIsApplyingDiscount(true);
    setTimeout(() => {
      setIsApplyingDiscount(false);
    }, 1500);
  };

  const QuantityControl = ({ product }) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => updateQuantity(product.id, Math.max(1, product.quantity - 1))}
        className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
      >
        <FaMinus className="w-3 h-3 text-white" />
      </button>
      <span className="w-8 text-center font-medium">{product.quantity}</span>
      <button
        onClick={() => updateQuantity(product.id, product.quantity + 1)}
        className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
      >
        <FaPlus className="w-3 h-3 text-white" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3 space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <FaShoppingCart className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold">Carrito de Compras</h1>
                <p className="text-gray-400">Tienes {totalItems} productos en tu carrito</p>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="bg-gray-800/50 rounded-2xl p-8 text-center">
                <FaShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-xl text-gray-400">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800/70"
                  >
                    <img
                      src={product.imagenes}
                      alt={product.nombre}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg mb-1">{product.nombre}</h3>
                      <p className="text-blue-400 font-bold text-xl mb-2">
                        ${(parseFloat(product.precio) || 0).toFixed(2)}
                      </p>
                      <QuantityControl product={product} />
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Envío</span>
                  <span className="text-green-400">Gratis</span>
                </div>
              </div>

              <div className="relative mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <FaGift className="text-blue-400" />
                  <span className="font-medium">Código de Descuento</span>
                </div>
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="w-full bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                  placeholder="Ingresa tu código"
                />
                <button
                  onClick={handleApplyDiscount}
                  disabled={isApplyingDiscount}
                  className={`mt-2 w-full py-2 rounded-lg transition-all duration-200 
                    ${isApplyingDiscount 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {isApplyingDiscount ? 'Aplicando...' : 'Aplicar'}
                </button>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Total</span>
                  <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                </div>
                <p className="text-gray-400 text-sm">Incluyendo IVA</p>
              </div>

              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2">
                <FaTruck />
                <span>Proceder al Pago</span>
              </button>
              
              <div className="mt-4 text-center text-sm text-gray-400">
                Pago seguro garantizado
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;