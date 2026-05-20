import axios from "axios";

//Variables del .env
const API_URL = import.meta.env.VITE_API_URL;
const CURRENT_NODE = import.meta.env.VITE_CURRENT_NODE;

//Instancia de axios
const api = axios.create({ baseURL: API_URL });

//Obtener productos
export const getProducts = async () => {
  try {
    const response = await api.get(`/api/${CURRENT_NODE}/productos`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return [];
  }
};
