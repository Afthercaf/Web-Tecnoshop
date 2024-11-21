import React from 'react';

const Cart = ({ cartItems, onRemove, onChangeQuantity }) => {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-4">
              <div>
                <h3>{item.name}</h3>
                <p>Precio: ${item.price}</p>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onChangeQuantity(index, e.target.value)}
                  className="w-16"
                />
                <button onClick={() => onRemove(index)} className="bg-red-500 text-white px-2 py-1 ml-2">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <strong>Total: ${total}</strong>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => {/* Lógica para proceder al pago */}}>
            Proceder al Pago
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
