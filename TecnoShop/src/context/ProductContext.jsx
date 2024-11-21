import { createContext, useContext, useState } from "react";
import {
  getProductsRequest,
  getProductRequest,
  createProductRequest,
  updateProductRequest,
  updateTiendaRequest,
  deleteProductRequest,
} from "../api/products";
import Cookies from "js-cookie";
import { obtenerTienda } from "../api/users";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within a ProductProvider");
  return context;
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await getProductRequest();
      console.log(res.data); // Agrega esto para depurar
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getTienda = async (id) => {
    try {
      const res = await obtenerTienda(id);
      console.log(res.data); // Agrega esto para depurar
      return res.data
    } catch (error) {
      console.error(error);
    }
  };
  


  const updateTienda = async (tiendaId, tiendaData) => {
    try {
      const res = await updateTiendaRequest(tiendaId, tiendaData); // Llamada a la API para actualizar la tienda
      console.log("Respuesta de la API:", res);
      
      // Aquí podríamos manejar la actualización de la tienda en el estado o mostrar un mensaje de éxito
      return res.data; // Retornamos la respuesta para uso posterior
    } catch (error) {
      console.error("Error al actualizar la tienda:", error);
    }
  };
  

  
  const getProduct = async (tiendaToken) => {
    try {
      const products = await getProductsRequest(tiendaToken); // Llama a la API para obtener los productos
      console.log('Respuesta de la API:', products);  // Muestra toda la respuesta de la API
      if (products && products.length > 0) {  // Verifica que haya productos (ya no usamos products.data)
        setProducts(products); // Actualiza el estado con los productos
        console.log('Productos obtenidos:', products); // Muestra los productos en consola
      } else {
        console.error('No se encontraron productos.');
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);  // Manejo de errores
    }
  };
  
  
  
  
  const createProduct = async (productData) => {
    try {
      const tiendaToken = Cookies.get("tiendaToken");
  
      if (!tiendaToken) {
        console.error("El tiendaToken no está disponible.");
        return;
      }
  
      const res = await createProductRequest(tiendaToken, productData);
      console.log("Respuesta de la API:", res);
      setProducts((prevProducts) => [...prevProducts, res]); // Añadimos el nuevo producto
      console.log("Producto creado:", res);
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };
  

  const updateProduct = async (id, product) => {
    try {
      const res = await updateProductRequest(id, product);
      if (res.data) {
        setProducts((prevProducts) =>
          prevProducts.map((prod) => (prod._id === id ? res.data : prod))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteProduct = async (id) => {
    try {
      const res = await deleteProductRequest(id);
      if (res.status === 204) setProducts(products.filter((prod) => prod._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        getTienda,
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        updateTienda,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export { ProductContext };