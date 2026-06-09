import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Box, Typography, Pagination, Skeleton, Chip } from "@mui/material";
import Sidebar from "../components/layout/Sidebar";
import InfoPanel from "../components/dashboard/InfoPanel";
import HistoryCard from "../components/history/HistoryCard";
import {
  VolunteerActivism,
  Inventory2,
  History as HistoryIcon,
  CallReceived,
  CallMade,
  Email,
} from "@mui/icons-material";
import {
  getDonaciones,
  getEntregas,
  getSolicitudesEnviadas,
  getSolicitudesRecibidas,
} from "../services/api";

const ESTADOS_MAP = {
  PENDIENTE: "EN ESPERA",
  EN_ESPERA: "EN ESPERA",
  ACEPTADO: "ACEPTADO",
  APROBADO: "ACEPTADO",
  // ✅ CORRECCIÓN: agregado EN_ESPERA con guión bajo como clave adicional
  // para cubrir el valor que regresa el campo `aprobacion` del backend
  RECHAZADO: "DENEGADO",
  DENEGADO: "DENEGADO",
};

// ✅ CORRECCIÓN: íconos resueltos en render, nunca guardados en estado
// Antes se guardaban elementos JSX dentro del array de history,
// lo que causaba re-render completo cada vez que se entraba a la pantalla
const resolveIcon = (iconType) => {
  switch (iconType) {
    case "donacion":
      return {
        icon: <VolunteerActivism />,
        iconBg: "#DCFCE7",
        iconColor: "#16A34A",
      };
    case "entrega":
      return { icon: <Inventory2 />, iconBg: "#FEF3C7", iconColor: "#D97706" };
    case "recibida":
      return {
        icon: <CallReceived />,
        iconBg: "#EDE9FE",
        iconColor: "#7C3AED",
      };
    case "enviada":
      return { icon: <CallMade />, iconBg: "#DBEAFE", iconColor: "#2563EB" };
    default:
      return { icon: <HistoryIcon />, iconBg: "#F3F4F6", iconColor: "#6B7280" };
  }
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [filter, setFilter] = useState("Todas");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const intervalRef = useRef(null);

  // ✅ CORRECCIÓN: useCallback para que el intervalo no capture
  // un closure desactualizado en cada render
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const [donaciones, entregas, enviadas, recibidas] = await Promise.all([
        getDonaciones(),
        getEntregas(),
        getSolicitudesEnviadas(),
        getSolicitudesRecibidas(),
      ]);

      const historialDonaciones = donaciones.map((d) => ({
        type: "Donaciones",
        title: "Donación recibida",
        // ✅ CORRECCIÓN: solo guardamos string "donacion", no el JSX <VolunteerActivism />
        iconType: "donacion",
        details: [
          `Producto: ${d.producto?.nombre ?? "Sin producto"}`,
          `Cantidad: ${d.cantidad} ${d.producto?.unit ?? ""}`,
          `Donante: ${d.donante ?? "Desconocido"}`,
        ],
        date: d.fecha,
      }));

      const historialEntregas = entregas.map((e) => ({
        type: "Entregas",
        title: "Entrega realizada",
        // ✅ CORRECCIÓN: solo guardamos string "entrega", no el JSX <Inventory2 />
        iconType: "entrega",
        details: [
          `Producto: ${e.producto?.nombre ?? "Sin producto"}`,
          `Cantidad: ${e.cantidad} ${e.producto?.unit ?? ""}`,
          `Beneficiario: ${e.beneficiario?.nombre ?? "Sin nombre"}`,
        ],
        date: e.fecha,
      }));

      // ✅ CORRECCIÓN: deduplicar antes de mapear para evitar entradas duplicadas
      // cuando la misma transferencia aparece en enviadas y recibidas
      const todasTransferencias = [
        ...new Map(
          [...enviadas, ...recibidas].map((t) => [
            t.transferencia_id || t.id,
            t,
          ]),
        ).values(),
      ];

      const historialTransferencias = todasTransferencias.map((t) => {
        const currentNode = import.meta.env.VITE_CURRENT_NODE?.toLowerCase();

        // ✅ CORRECCIÓN: la lógica correcta según el modelo del backend:
        //   origen  = nodo que TIENE el producto (aprueba/rechaza)
        //   destino = nodo que PIDIÓ el producto (tú cuando enviaste)
        // Por lo tanto: "yo envié" se cumple cuando destino === mi nodo
        const yoEnvie = t.destino?.toLowerCase() === currentNode;

        // ✅ CORRECCIÓN: leer `aprobacion` primero, luego `estado`
        // porque el backend actualiza `aprobacion` al aprobar/rechazar,
        // no el campo `estado`
        const estadoRaw = (t.aprobacion || t.estado || "").toUpperCase();
        const estado = ESTADOS_MAP[estadoRaw] ?? "EN ESPERA";

        return {
          type: "Solicitudes",
          // ✅ CORRECCIÓN: solo guardamos string, no JSX
          iconType: yoEnvie ? "enviada" : "recibida",

          // ✅ CORRECCIÓN: títulos correctos según el modelo
          //   enviada  → le pedí a `origen`
          //   recibida → me pidió `destino`
          // Antes estaba invertido (usaba origen/destino al revés)
          title: yoEnvie
            ? `Solicitud enviada a ${t.origen}`
            : `Solicitud recibida de ${t.destino}`,

          details: [
            `Producto: ${t.producto_nombre}`,
            `Cantidad: ${t.cantidad}`,
            `Estado: ${estado}`,
          ],
          status: estado,
          date: t.created_at,
        };
      });

      const merged = [
        ...historialDonaciones,
        ...historialEntregas,
        ...historialTransferencias,
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setHistory(merged);
      setHasLoaded(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
    // ✅ CORRECCIÓN: el intervalo ahora usa la referencia estable de useCallback
    // antes se recreaba en cada render causando múltiples intervalos acumulados
    intervalRef.current = setInterval(loadHistory, 5000);
    return () => clearInterval(intervalRef.current);
  }, [loadHistory]);

  const filteredHistory = useMemo(() => {
    if (filter === "Todas") return history;
    return history.filter((item) => item.type === filter);
  }, [history, filter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredHistory.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const filters = [
    { label: "Todas", icon: <HistoryIcon sx={{ fontSize: 18 }} /> },
    { label: "Donaciones", icon: <VolunteerActivism sx={{ fontSize: 18 }} /> },
    { label: "Solicitudes", icon: <Email sx={{ fontSize: 18 }} /> },
    { label: "Entregas", icon: <Inventory2 sx={{ fontSize: 18 }} /> },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          padding: { xs: 2, sm: 3, md: 4 },
          backgroundColor: "#F9FAFB",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: 4, color: "#171717" }}
        >
          Historial
        </Typography>

        <Box sx={{ display: "grid", gap: 3 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {filters.map((item) => (
              <Chip
                key={item.label}
                icon={item.icon}
                label={item.label}
                clickable
                onClick={() => {
                  setFilter(item.label);
                  setCurrentPage(1);
                }}
                sx={{
                  height: 42,
                  borderRadius: "14px",
                  fontWeight: 600,
                  fontSize: "14px",
                  transition: "0.2s ease",
                  backgroundColor:
                    filter === item.label ? "#F97316" : "#F5F5F4",
                  color: filter === item.label ? "#FFFFFF" : "#525252",
                  border:
                    filter === item.label
                      ? "1px solid #F97316"
                      : "1px solid #E7E5E4",
                  "& .MuiChip-icon": {
                    color: filter === item.label ? "#FFFFFF" : "#737373",
                    fontSize: "18px",
                    marginLeft: "6px",
                  },
                  "&:hover": {
                    transform: "translateY(-1px)",
                    backgroundColor:
                      filter === item.label ? "#EA580C" : "#EEEEEE",
                  },
                }}
              />
            ))}
          </Box>

          <InfoPanel
            title="Actividad reciente"
            scrollable={false}
            icon={<HistoryIcon sx={{ color: "#7C3AED" }} />}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {loading && !hasLoaded ? (
                [...Array(5)].map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 3,
                      pb: 3,
                      borderBottom: index !== 4 ? "1px solid #E7E5E4" : "none",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                      }}
                    >
                      <Skeleton variant="rounded" width={64} height={64} />

                      <Box sx={{ flex: 1 }}>
                        <Skeleton width="40%" height={32} />

                        <Skeleton width="60%" height={24} />

                        <Skeleton width="50%" height={24} />

                        <Skeleton width="35%" height={24} />
                      </Box>

                      <Skeleton width={120} height={40} />
                    </Box>
                  </Box>
                ))
              ) : currentItems.length === 0 ? (
                <Typography color="text.secondary">
                  Sin actividad reciente.
                </Typography>
              ) : (
                currentItems.map((item, index) => {
                  const { icon, iconBg, iconColor } = resolveIcon(
                    item.iconType,
                  );

                  return (
                    <HistoryCard
                      key={`${item.type}-${item.date}-${index}`}
                      {...item}
                      icon={icon}
                      iconBg={iconBg}
                      iconColor={iconColor}
                      isLast={index === currentItems.length - 1}
                    />
                  );
                })
              )}
            </Box>

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, value) => setCurrentPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </InfoPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default History;
