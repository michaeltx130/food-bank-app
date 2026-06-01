import { useState, useEffect } from "react";
import RequestCard from "../../components/requests/RequestCard";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import {
  getSolicitudesEnviadas,
  getBranchProducts,
  createSolicitud,
} from "../../services/api";

const CURRENT_NODE = import.meta.env.VITE_CURRENT_NODE;

const SUCURSALES = [
  { key: "comondu", label: "Comondú" },
  { key: "lapaz", label: "La Paz" },
  { key: "loreto", label: "Loreto" },
  { key: "mulege", label: "Mulegé" },
];

const Sent = ({ open, setOpen }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [productosSucursal, setProductosSucursal] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);

  const [sucursal, setSucursal] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [enviando, setEnviando] = useState(false);

  const fetchSolicitudes = async () => {
    setLoading(true);
    const data = await getSolicitudesEnviadas();
    setSolicitudes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleSucursalChange = async (e) => {
    const valor = e.target.value;

    setSucursal(valor);
    setProductoId("");

    setLoadingProductos(true);

    const data = await getBranchProducts(valor);

    setProductosSucursal(data.productos || data);
    setLoadingProductos(false);
  };

  const handleEnviar = async () => {
    if (!sucursal || !productoId || !cantidad) return;

    setEnviando(true);

    try {
      const productoElegido = productosSucursal.find(
        (p) => p.id === Number(productoId)
      );

      await createSolicitud({
        producto_nombre: productoElegido?.nombre,
        cantidad: Number(cantidad),
        origen: CURRENT_NODE,
        destino: sucursal,
      });

      setOpen(false);
      setSucursal("");
      setProductoId("");
      setCantidad("");

      fetchSolicitudes();
    } catch (e) {
      console.error("Error enviando solicitud:", e);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          marginBottom: 8,
        }}
      >
        {loading ? (
          <CircularProgress sx={{ mt: 4 }} />
        ) : solicitudes.length === 0 ? (
          <Typography color="text.secondary">
            No hay solicitudes enviadas.
          </Typography>
        ) : (
          solicitudes.map((s) => (
            <RequestCard
              key={s.id}
              solicitud={s}
              type="sent"
              showActions={false}
            />
          ))
        )}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "40px" },
        }}
      >
        <DialogContent sx={{ padding: "40px" }}>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            Nueva Solicitud
          </Typography>

          <Typography color="text.secondary" mb={4}>
            Completa la información para solicitar productos de otra sucursal.
          </Typography>

          <Typography variant="subtitle2" mb={1}>
            Sucursal destino
          </Typography>

          <TextField
            select
            fullWidth
            sx={{ marginBottom: 3 }}
            value={sucursal}
            onChange={handleSucursalChange}
          >
           {SUCURSALES
  .filter(
    (s) =>
      s.key !==
      CURRENT_NODE
  )
  .map((s) => (
    <MenuItem
      key={s.key}
      value={s.key}
    >
      {s.label}
    </MenuItem>
  ))}
          </TextField>

          <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" mb={1}>
                Producto
              </Typography>

              <TextField
                select
                fullWidth
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                disabled={loadingProductos || !sucursal}
              >
                {loadingProductos ? (
                  <MenuItem disabled>Cargando...</MenuItem>
                ) : (
                  productosSucursal.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nombre} — {p.cantidad} {p.unit} disponibles
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Box>

            <Box sx={{ width: "180px" }}>
              <Typography variant="subtitle2" mb={1}>
                Cantidad
              </Typography>

              <TextField
                type="number"
                fullWidth
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setOpen(false)}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                paddingY: 1.5,
              }}
            >
              Cancelar
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="warning"
              onClick={handleEnviar}
              disabled={
                enviando || !sucursal || !productoId || !cantidad
              }
              sx={{
                borderRadius: 3,
                textTransform: "none",
                paddingY: 1.5,
              }}
            >
              {enviando ? "Enviando..." : "Enviar Solicitud"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sent;