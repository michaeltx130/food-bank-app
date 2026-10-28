import { useEffect, useState, useMemo } from "react";
import RequestCard from "../../components/requests/RequestCard";
import EmptyState from "../../components/common/EmptyState";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Typography,
  Pagination,
  Skeleton,
  Card,
  CardContent,
  Dialog,
  TextField,
  Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  getSolicitudesRecibidas,
  aprobarSolicitud,
  rechazarSolicitud,
} from "../../services/api";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    "&.Mui-focused fieldset": {
      borderColor: "#029739",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#029739",
  },
};

const Received = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openReject, setOpenReject] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [rechazando, setRechazando] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const itemsPerPage = 5;

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const data = await getSolicitudesRecibidas();
        if (!cancelled) setSolicitudes(data || []);
      } catch (error) {
        console.error("Error al obtener solicitudes recibidas:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [refreshKey]);

  const solicitudesAgrupadas = useMemo(() => {
    const VENTANA_MS = 10000;
    const grupos = [];

    [...solicitudes]
      .sort(
        (a, b) =>
          new Date(b.created_at || b.fecha) - new Date(a.created_at || a.fecha),
      )
      .forEach((s) => {
        const fecha = s.created_at || s.fecha;
        const tiempo = new Date(fecha).getTime();
        const sucursalSolicitante = s.origen;

        let grupo = grupos.find(
          (g) =>
            g.origen === sucursalSolicitante &&
            Math.abs(g.tiempo - tiempo) <= VENTANA_MS,
        );

        if (!grupo) {
          grupo = {
            id: `${sucursalSolicitante}_${fecha}`,
            destino: s.destino,
            origen: s.origen,
            created_at: fecha,
            tiempo,
            aprobacion: s.aprobacion || s.estado,
            error: s.error,
            items: [],
            rawIds: [],
          };
          grupos.push(grupo);
        }

        grupo.rawIds.push(s.transferencia_id || s.id);
        grupo.items.push({
          nombre: s.producto_nombre,
          cantidad: s.cantidad,
          unit: s.producto?.unit || s.unit || "pz",
        });
      });

    return grupos;
  }, [solicitudes]);

  const handleAprobar = async (pedido) => {
    try {
      if (pedido.rawIds && pedido.rawIds.length > 0) {
        await Promise.all(
          pedido.rawIds.map((id) => aprobarSolicitud(id, pedido.origen)),
        );
      } else {
        await aprobarSolicitud(pedido.transferencia_id, pedido.origen);
      }
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error("Error aprobando pedido:", error);
    }
  };

  const handleRechazar = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setMotivo("");
    setOpenReject(true);
  };

  const handleModalClose = () => {
    setOpenReject(false);
    setSolicitudSeleccionada(null);
    setMotivo("");
  };

  const confirmarRechazo = async () => {
    if (!motivo.trim() || rechazando || !solicitudSeleccionada) return;

    setRechazando(true);
    try {
      const ids = solicitudSeleccionada.rawIds || [
        solicitudSeleccionada.transferencia_id,
      ];
      await Promise.all(
        ids.map((id) =>
          rechazarSolicitud(id, solicitudSeleccionada.origen, motivo),
        ),
      );

      handleModalClose();
      // Pasa false aquí también
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error("Error rechazando pedido:", error);
    } finally {
      setRechazando(false);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSolicitudes = solicitudesAgrupadas.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(solicitudesAgrupadas.length / itemsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            sx={{
              borderRadius: "12px",
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
              border: "1px solid #E7E5E4",
            }}
          >
            <CardContent>
              <Skeleton width="35%" height={25} />
              <Box sx={{ mt: 2 }}>
                <Skeleton width="70%" height={45} />
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Skeleton width={120} height={25} />
                <Skeleton width={180} height={40} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          minHeight: "calc(100vh - 220px)",
        }}
      >
        {solicitudesAgrupadas.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              width: "100%",
              py: 8,
            }}
          >
            <EmptyState
              icon={CheckCircleIcon}
              title="Todo al día"
              description="No tienes solicitudes pendientes por responder."
            />
          </Box>
        ) : (
          <>
            {currentSolicitudes.map((pedido) => (
              <RequestCard
                key={pedido.id}
                solicitud={pedido}
                type="received"
                onAprobar={() => handleAprobar(pedido)}
                onRechazar={() => handleRechazar(pedido)}
              />
            ))}

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, value) => setCurrentPage(value)}
                  sx={{
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "#029739",
                      color: "#ffffff",
                      "&:hover": {
                        backgroundColor: "#15803d",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* MODAL DE RECHAZO */}
      <Dialog
        open={openReject}
        onClose={rechazando ? undefined : handleModalClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "100%",
            maxWidth: "576px",
            margin: "16px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "32px 40px 24px 24px",
            gap: "8px",
            boxSizing: "border-box",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "24px",
              color: "#171717",
              lineHeight: 1.2,
            }}
          >
            Rechazar solicitud
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "0px 24px 32px 24px",
            gap: 2,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Escribe el motivo del rechazo para la sucursal solicitante.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ejemplo: Tenemos alta demanda de frijol y bajo stock"
            sx={textFieldStyle}
          />

          <Box
            sx={{
              display: "flex",
              gap: "16px",
              width: "100%",
              marginTop: 1,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={handleModalClose}
              disabled={rechazando}
              sx={{
                borderRadius: "12px",
                paddingY: 1.2,
                textTransform: "none",
                fontWeight: 400,
                borderColor: "#E7E5E4",
                color: "#44403C",
                "&:hover": {
                  borderColor: "#A8A29E",
                  backgroundColor: "#F5F5F4",
                },
              }}
            >
              Cancelar
            </Button>

            <LoadingButton
              fullWidth
              variant="contained"
              color="error"
              loading={rechazando}
              disabled={!motivo.trim() || rechazando}
              onClick={confirmarRechazo}
              sx={{
                borderRadius: "12px",
                paddingY: 1.2,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              Rechazar
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Received;
