import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const CURRENT_NODE = import.meta.env.VITE_CURRENT_NODE;

const NODES = {
  comondu: "100.82.181.5:3001",
  lapaz: "100.114.40.70:3002",
  loreto: "100.101.236.118:3003",
  mulege: "100.83.23.115:3004",
};

const api = axios.create({
  baseURL: API_URL,
});

// Obtener productos
export const getProducts = async () => {
  try {
    const response = await api.get(`/api/${CURRENT_NODE}/productos`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return [];
  }
};

// Obtener productos de otro nodo
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

// Obtener beneficiarios
export const getBeneficiarios = async () => {
  try {
    const response = await api.get(`/api/${CURRENT_NODE}/beneficiarios`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo beneficiarios:", error);
    return [];
  }
};

// Crear producto
export const createProduct = async (productData) => {
  const response = await axios.post(
    `${API_URL}/api/${CURRENT_NODE}/productos`,
    productData,
  );
  return response.data;
};

// Obtener categorías
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/api/${CURRENT_NODE}/categorias`);
  return response.data;
};

// Obtener donaciones
export const getDonaciones = async () => {
  try {
    const response = await api.get(`/api/${CURRENT_NODE}/donaciones`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo donaciones:", error);
    return [];
  }
};

// Crear donación
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

// Crear entrega
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

// Crear familia
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
// Se llama al propio servidor (api) — él sabe que es el origen y
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

// Crear categoría
export const createCategory = async (nombre) => {
  const response = await api.post(`/api/${CURRENT_NODE}/categorias`, {
    nombre,
  });

  return response.data;
};

// Crear solicitud / transferencia
export const createSolicitud = async ({
  producto_nombre,
  cantidad,
  origen,
  destino,
}) => {
  try {
    const response = await api.post(`/api/${CURRENT_NODE}/transferencias`, {
      producto_nombre,
      cantidad,
      origen,
      destino,
      estado: "PENDIENTE",
    });

    return response.data;
  } catch (error) {
    console.error("Error creando solicitud:", error);
    throw error;
  }
};

// Obtener solicitudes enviadas
export const getSolicitudesEnviadas = async () => {
  try {
    const response = await api.get(`/api/${CURRENT_NODE}/transferencias`);

    const todas = response.data || [];

    return todas
      .filter((t) => t.origen?.toLowerCase() === CURRENT_NODE.toLowerCase())
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error("Error obteniendo solicitudes enviadas:", error);
    return [];
  }
};

// Obtener solicitudes recibidas
export const getSolicitudesRecibidas = async () => {
  try {
    const respuestas = await Promise.all(
      Object.entries(NODES).map(async ([branch, host]) => {
        try {
          const r = await axios.get(
            `http://${host}/api/${branch}/transferencias`,
            {
              timeout: 3000,
            },
          );

          return r.data || [];
        } catch {
          console.log(`${branch} no disponible`);
          return [];
        }
      }),
    );

    const todas = respuestas.flat();

    const recibidas = todas.filter(
      (t) => t.destino?.toLowerCase() === CURRENT_NODE.toLowerCase(),
    );

    return [
      ...new Map(
        recibidas.map((t) => [t.transferencia_id || t.id, t]),
      ).values(),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error("Error obteniendo solicitudes recibidas:", error);
    return [];
  }
};

// Aprobar solicitud
export const aprobarSolicitud = async (transferenciaId, origen) => {
  try {
    const response = await axios.post(
      `http://${NODES[origen]}/api/${origen}/transferencias/${transferenciaId}/aprobar`,
    );

    return response.data;
  } catch (error) {
    console.error("Error aprobando solicitud:", error);
    throw error;
  }
};

// Rechazar solicitud
export const rechazarSolicitud = async (transferenciaId, origen) => {
  try {
    const response = await axios.post(
      `http://${NODES[origen]}/api/${origen}/transferencias/${transferenciaId}/rechazar`,
    );

    return response.data;
  } catch (error) {
    console.error("Error rechazando solicitud:", error);
    throw error;
  }
};

export const getEntregas = async () => {
  try {
    const response = await api.get(`/api/${CURRENT_NODE}/entregas`);

    return response.data;
  } catch (error) {
    console.error("Error obteniendo entregas:", error);

    return [];
  }
};

export const getTransferencias = async () => {
  try {
    const response = await api.get(`/api/${CURRENT_NODE}/transferencias`);

    return response.data;
  } catch (error) {
    console.error("Error obteniendo transferencias:", error);

    return [];
  }
};
