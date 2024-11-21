import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity } = location.state || {};
  const [step, setStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Datos de envío
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [interiorNumber, setInteriorNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [country, setCountry] = useState('México');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [references, setReferences] = useState('');

  // Datos de pago
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  useEffect(() => {
    if (!product) {
      navigate('/');
    } else {
      setTotalPrice(product.price * quantity);
    }
  }, [product, quantity, navigate]);

  const handleNextStep = () => setStep(step + 1);
  const handleConfirmPurchase = () => {
    alert('Compra confirmada');
  };

  return (
    <div className="flex-1 p-8 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto max-w-5xl bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Paso 1: Datos de Envío */}
        {step === 1 && (
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Detalles de Envío</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border p-2 rounded-lg" required />
              <input type="text" placeholder="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border p-2 rounded-lg" required />
              <input type="text" placeholder="Calle" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-2 rounded-lg" required />
              <input type="text" placeholder="Número Exterior" value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} className="border p-2 rounded-lg" required />
              <input type="text" placeholder="Número Interior" value={interiorNumber} onChange={(e) => setInteriorNumber(e.target.value)} className="border p-2 rounded-lg" />
              <input type="text" placeholder="Código Postal" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="border p-2 rounded-lg" required />
              <input type="text" placeholder="Delegación/Municipio" value={municipality} onChange={(e) => setMunicipality(e.target.value)} className="border p-2 rounded-lg" required />
              <input type="text" placeholder="Colonia" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="border p-2 rounded-lg" required />
              <input type="text" placeholder="País" value={country} onChange={(e) => setCountry(e.target.value)} className="border p-2 rounded-lg" required />
              <input type="text" placeholder="Estado" value={state} onChange={(e) => setState(e.target.value)} className="border p-2 rounded-lg" required />
              <input type="text" placeholder="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} className="border p-2 rounded-lg" required />
              <input type="text" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 rounded-lg" required />
              <textarea placeholder="Referencias" value={references} onChange={(e) => setReferences(e.target.value)} className="border p-2 rounded-lg col-span-2" />
            </div>
            <button
              onClick={handleNextStep}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Siguiente: Método de Pago
            </button>
          </div>
        )}

        {/* Paso 2: Método de Pago */}
        {step === 2 && (
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Método de Pago</h2>
            <div className="space-y-4">
              <div className="border p-4 rounded-lg flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4"
                />
                <label className="text-lg font-medium">PayPal Express Checkout</label>
              </div>
              <div className="border p-4 rounded-lg flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CreditCard"
                  checked={paymentMethod === 'CreditCard'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4"
                />
                <label className="text-lg font-medium">Pago con Tarjeta de Crédito o Débito</label>
              </div>
              <div className="border p-4 rounded-lg flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Oxxo"
                  checked={paymentMethod === 'Oxxo'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4"
                />
                <label className="text-lg font-medium">Pago en OXXO</label>
              </div>
              
              {/* Opciones de pago según el método */}
              {paymentMethod === 'PayPal' && (
                <div className="mt-4">
                  <label className="block text-gray-700">Correo Electrónico de PayPal</label>
                  <input
                    type="email"
                    placeholder="Correo electrónico de PayPal"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="border p-2 rounded-lg w-full mt-2"
                  />
                </div>
              )}
              
              {paymentMethod === 'CreditCard' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-gray-700">Número de Tarjeta</label>
                    <input
                      type="text"
                      placeholder="Número de tarjeta"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="border p-2 rounded-lg w-full mt-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Fecha de Expiración (MM/AA)</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="border p-2 rounded-lg w-full mt-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Código CVV</label>
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                      className="border p-2 rounded-lg w-full mt-2"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'Oxxo' && (
                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                  <p className="text-yellow-700">
                    Al seleccionar pago en OXXO, recibirás un recibo con un código de barras que podrás presentar en cualquier tienda OXXO para realizar el pago. 
                    Ten en cuenta que la confirmación del pago puede tardar hasta 48 horas.
                  </p>
                </div>
              )}

              <button
                onClick={handleConfirmPurchase}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 mt-6"
              >
                Confirmar Compra
              </button>
            </div>
          </div>
        )}

        {/* Resumen de Compra */}
        <div className="border-l md:col-span-1 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Resumen de Compra</h3>
          <p className="text-sm">Producto: <span className="font-medium">{product?.name}</span></p>
          <p className="text-sm">Cantidad: <span className="font-medium">{quantity}</span></p>
          <p className="text-sm">Precio Unitario: <span className="font-medium">${product?.price}</span></p>
          <hr className="my-4" />
          <p className="text-lg font-bold">Total: <span className="text-green-600">${totalPrice}</span></p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
