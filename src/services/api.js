import axios from "axios";

//Variables del .env
const API_URL = import.meta.env.VITE_API_URL;
const CURRENT_NODE = import.meta.env.VITE_CURRENT_NODE;

const NODES = {
  comondu: "100.82.181.5:3001",
  lapaz: "100.114.40.70:3002",
  loreto: "100.101.236.118:3003",
  mulege: "100.83.23.115:3004",
};

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

//Obtener productos de otro nodo
export const getBranchProducts = async (branch) => {
  try {
    const response = await axios.get(
      `http://${NODES[branch]}/api/${branch}/productos`,
    );

    return response.data;
  } catch (error) {
    console.error(`Error obteniendo productos de ${branch}:`, error);

    return [];
  }
};
//Obtener beneficiarios
export const getBeneficiarios = async () => {
  try {
    const response = await api.get(`/api/${CURRENT_NODE}/beneficiarios`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo beneficiarios:", error);
    return [];
  }
};

//Crear producto
export const createProduct = async (productData) => {
  const response = await axios.post(
    `${API_URL}/api/${CURRENT_NODE}/productos`,
    productData,
  );
  return response.data;
};

//Obtener categorías
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/api/${CURRENT_NODE}/categorias`);
  return response.data;
};

//obtener donaciones
export const getDonaciones = async () => {
  try {
    const response = await api.get(`/api/${CURRENT_NODE}/donaciones`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo donaciones:", error);
    return [];
  }
};

//Crear donacion
export const createDonacion = async ({
  donante,
  producto,
  cantidad,
  unit,
  categoria_id,
}) => {
  const productoCreado = await createProduct({
    nombre: producto,
    cantidad,
    unit,
    categoria_id,
  });

  const response = await api.post(`/api/${CURRENT_NODE}/donaciones`, {
    donante,
    producto_id: productoCreado.id,
    cantidad,
  });

  return response.data;
};
//Crear entrega
export const createEntrega = async ({
  beneficiario_id,
  producto_id,
  cantidad,
}) => {
  try {
    const response = await api.post(`/api/${CURRENT_NODE}/entregas`, {
      beneficiario_id,
      producto_id,
      cantidad,
    });
    return response.data;
  } catch (error) {
    console.error("Error creando entrega:", error);
    return null;
  }
};

//crear familia
export const createFamilia = async (familiaData) => {
  try {
    const response = await api.post(
      `/api/${CURRENT_NODE}/familias`,
      familiaData,
    );
    return response.data;
  } catch (error) {
    console.error("Error creando familia:", error);
    return null;
  }
};

// Solicitar producto a otra sucursal.
// Se llama al propio servidor (api) — él sabe que es el origen y enruta a destino.
export const requestProduct = async (
  sourceBranchKey,
  productoId,
  cantidad,
  motivo,
) => {
  try {
    const response = await axios.post(
      `http://${NODES[sourceBranchKey]}/api/red/productos/enviar`,
      {
        producto_id: productoId,
        cantidad,
        destino: CURRENT_NODE,
        motivo,
      },
    );

    return response.data;
  } catch (error) {
    console.error(`Error solicitando producto a ${sourceBranchKey}:`, error);

    throw error;
  }
};

//Crear categoria
export const createCategory = async (nombre) => {
  const response = await api.post(`/api/${CURRENT_NODE}/categorias`, {
    nombre,
  });
  return response.data;
};
