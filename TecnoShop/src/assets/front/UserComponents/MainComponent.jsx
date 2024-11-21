import React, { useState } from 'react';
import UserHeader from './UserHeader';
import UserPage from './UserPage';

const MainComponent = () => {
  const [user, setUser] = useState('Usuario'); // o tu lógica de usuario
  const [products, setProducts] = useState([
    {
      name: 'Producto 1',
      price: '$100',
      quantity: '10',
      image: 'url_to_image_1',
      category: 'Electrónica',
      store: 'Bitplus',
      rating: 4.5,
    },
    {
      name: 'Producto 2',
      price: '$150',
      quantity: '5',
      image: 'url_to_image_2',
      category: 'Electrónica',
      store: 'Tienda 2',
      rating: 4.0,
    },
  ]); // Asegúrate de que estos productos tengan imágenes y datos válidos
  const [stores, setStores] = useState([
    { name: 'Bitplus' },
    { name: 'Tienda 2' },
  ]); // Inicializa tus tiendas aquí
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <UserHeader user={user} setUser={setUser} products={products} stores={stores} setSearchResults={setSearchResults} />
      <UserPage products={searchResults.length > 0 ? searchResults : products} setSearchResults={setSearchResults} />
      {/* Otros componentes */}
    </div>
  );
};

export default MainComponent;
