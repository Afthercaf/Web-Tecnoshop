import axios from "./axios.js";

export const getProductsRequest = async (tiendaToken) => {
  try {
    const res = await axios.get('/productos', {
      headers: { Authorization: `Bearer ${tiendaToken}` },
    });
    console.log('Datos de la respuesta de la API:', res.data);  // Muestra los datos completos
    return res.data;  // Devuelve los datos obtenidos de la API
  } catch (error) {
    if (error.response) {
      console.error('Error en la respuesta:', error.response.data);  // Error en la respuesta
    } else if (error.request) {
      console.error('Error en la solicitud:', error.request);  // Error en la solicitud
    } else {
      console.error('Error:', error.message);  // Error general
    }
    return null;  // Retorna null en caso de error
  }
};

export const getProductRequest = async () => axios.get(`/producto`);


export const createProductRequest = async (productData) => {
  console.log("Datos a enviar:", productData); // Para verificar los datos
  try {
    const response = await axios.post("/productos", productData, {
      withCredentials: true, // Asegúrate de que se incluyan las cookies si usas autenticación basada en cookies
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};




export const updateProductRequest = async (id, product) =>
  axios.put(`/productos/${id}`, product);

export const deleteProductRequest = async (id) =>
  axios.delete(`/productos/${id}`);



// Función para actualizar los datos de la tienda
export const updateTiendaRequest = async (tiendaId, tiendaData) => {
  try {
    // Realizamos la solicitud PUT a la API de la tienda
    const response = await axios.put(
      `/tiendas/${tiendaId}`,
      tiendaData);
    return response.data; // Retornamos la respuesta con los datos actualizados
  } catch (error) {
    console.error("Error al actualizar la tienda:", error);
    throw error; // Lanza el error para manejarlo en otro lugar si es necesario
  }
};
