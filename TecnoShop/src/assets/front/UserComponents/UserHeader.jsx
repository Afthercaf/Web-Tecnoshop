import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import logo from '/src/assets/front/images/tecnoshop.png';

const UserHeader = ({ products, stores, isSidebarCollapsed, setSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStores = stores.filter(store =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults([
      ...filteredProducts.map(product => ({ ...product, type: "product" })),
      ...filteredStores.map(store => ({ ...store, type: "store" }))
    ]);
  };

  return (
    <header
      className="bg-white shadow p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50"
      style={{ marginLeft: isSidebarCollapsed ? '5rem' : '16rem' }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="TecnoShop Logo" className="h-12 w-12 rounded-full shadow-lg" />
          <span className="text-gray-700 font-bold text-2xl">TecnoShop</span>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex items-center w-1/2 relative">
        <input
          type="text"
          placeholder="Encuentra lo que quieres"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-l-md text-gray-700"
        />
        <button type="submit" className="p-2 bg-gray-200 rounded-r-md">
          <FaSearch className="text-gray-600" />
        </button>
      </form>
    </header>
  );
};

export default UserHeader;