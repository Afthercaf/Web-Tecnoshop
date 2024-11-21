// src/assets/front/Features.jsx
import React from 'react';
import securePaymentIcon from './images/secure_payment.png';
import freeShippingIcon from './images/free_shipping.png';
import guaranteedIcon from './images/guaranteed.png';

const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg shadow-sm">
    <img src={icon} alt={title} className="h-12 mb-4" /> 
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-center text-gray-600">{description}</p>
  </div>
);

const Features = () => (
  <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-10 bg-white">
    <FeatureCard 
      icon={securePaymentIcon} 
      title="Pagos" 
      description="Pagos seguros." 
    />
    <FeatureCard 
      icon={freeShippingIcon} 
      title="Envíos" 
      description="Envío seguro." 
    />
    <FeatureCard 
      icon={guaranteedIcon} 
      title="Productos garantizados" 
      description="Garantía en todos nuestros productos" 
    />
  </section>
);

export default Features;