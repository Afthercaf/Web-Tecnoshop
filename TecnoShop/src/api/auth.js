import axios from "./axios.js";

export const registerRequest = async (user) =>
  axios.post(`/auth/register`, user);

export const loginRequest = async (user) => axios.post(`/auth/login`, user);

export const verifyTokenRequest = async () => axios.get(`/auth/verify`);

export const registerTiendaRequest = async (tienda) =>
  axios.post(`/auth/register-tienda`, tienda); // Ajusta la ruta según sea necesario

export const loginTiendaRequest = async (tienda) => 
  axios.post(`/auth/login-tienda`, tienda); // Ajusta la ruta según sea necesario

export const verifyTiendaTokenRequest = async () => axios.get(`/auth/verify-tienda`);