import axios from "./axios.js";

export const getUserRequest = async (id) => {
  console.log("Llamada a la API para obtener usuario con ID:", id); // Consola para verificar el ID en la solicitud a la API
  return axios.get(`/users/${id}`);
};

export const updateUserRequest = async (id, user) => {
  console.log("Llamada a la API para actualizar usuario con ID:", id, "y datos:", user); // Consola para verificar el ID y los datos en la actualización
  return axios.put(`/users/${id}`, user);
};

export const obtenerTienda = async (id) => axios.get(`/tiendas/${id}`);
