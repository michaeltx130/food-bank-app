import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Pagination, Skeleton, Chip } from "@mui/material";
import MainLayout from "../components/layout/MainLayout";
import HistoryCard from "../components/history/HistoryCard";
import EmptyState from "../components/common/EmptyState";
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

const CURRENT_NODE = import.meta.env.VITE_CURRENT_NODE;

const ESTADOS_MAP = {
  PENDIENTE: "EN ESPERA",
  EN_ESPERA: "EN ESPERA",
  ACEPTADO: "ACEPTADO",
  APROBADO: "ACEPTADO",
  RECHAZADO: "DENEGADO",
  DENEGADO: "DENEGADO",
};

// Se revierte al color naranja unificado para todos los iconos de la línea de tiempo
const resolveIcon = (iconType) => {
  switch (iconType) {
    case "donacion":
      return {
        icon: <VolunteerActivism />,
        iconBg: "#fff4ed",
        iconColor: "#FA7B0A",
      };
    case "entrega":
      return {
        icon: <Inventory2 />,
        iconBg: "#fff4ed",
        iconColor: "#FA7B0A",
      };
    case "recibida":
      return {
        icon: <CallReceived />,
        iconBg: "#fff4ed",
        iconColor: "#FA7B0A",
      };
    case "enviada":
      return {
        icon: <CallMade />,
        iconBg: "#fff4ed",
        iconColor: "#FA7B0A",
      };
    default:
      return { icon: <HistoryIcon />, iconBg: "#F3F4F6", iconColor: "#6B7280" };
  }
};

const corregirFechaTransferencia = (fecha) => {
  if (!fecha) return fecha;
  const hora = new Date(String(fecha).replace(/(Z|[+-]\d{2}:\d{2})$/, ""));
  return Number.isNaN(hora.getTime()) ? fecha : hora.toISOString();
};

const buildHistory = async () => {
  const [donaciones, entregas, enviadas, recibidas] = await Promise.all([
    getDonaciones(),
    getEntregas(),
    getSolicitudesEnviadas(),
    getSolicitudesRecibidas(),
  ]);

  const historialDonaciones = donaciones.map((d) => ({
    type: "Donaciones",
    title: "Donación recibida",
    iconType: "donacion",
    details: [
      `Producto: ${d.producto?.nombre ?? "Sin producto"}`,
      `Cantidad: ${d.cantidad} ${d.producto?.unit ?? ""}`,
      `Donante: ${d.donante ?? "Desconocido"}`,
    ],
    date: d.fecha || d.created_at,
  }));

  const historialEntregas = entregas.map((e) => ({
    type: "Entregas",
    title: "Entrega realizada",
    iconType: "entrega",
    details: [
      `Producto: ${e.producto?.nombre ?? "Sin producto"}`,
      `Cantidad: ${e.cantidad} ${e.producto?.unit ?? ""}`,
      `Beneficiario: ${e.beneficiario?.nombre ?? "Sin nombre"}`,
    ],
    date: e.fecha || e.created_at,
  }));

  const todasTransferencias = [
    ...new Map(
      [...enviadas, ...recibidas].map((t) => [t.transferencia_id || t.id, t]),
    ).values(),
  ];

  const historialTransferencias = todasTransferencias.map((t) => {
    const currentNode = CURRENT_NODE?.toLowerCase();
    const yoEnvie = t.destino?.toLowerCase() === currentNode;

    const estadoRaw = (t.aprobacion || t.estado || "").toUpperCase();
    const estado = ESTADOS_MAP[estadoRaw] ?? "EN ESPERA";

    return {
      type: "Solicitudes",
      iconType: yoEnvie ? "enviada" : "recibida",
      title: yoEnvie
        ? `Solicitud enviada a ${t.origen}`
        : `Solicitud recibida de ${t.destino}`,
      details: [`Producto: ${t.producto_nombre}`, `Cantidad: ${t.cantidad}`],
      status: estado,
      date: corregirFechaTransferencia(t.created_at),
    };
  });

  const merged = [
    ...historialDonaciones,
    ...historialEntregas,
    ...historialTransferencias,
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return merged;
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todas");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      try {
        const merged = await buildHistory();
        if (!cancelled) setHistory(merged);
      } catch (error) {
        console.error("Error obteniendo historial:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    refresh();
    const interval = setInterval(refresh, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

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
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          width: "100%",
        }}
      >
        {/* 1. HEADER */}
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#171717" }}>
          Historial
        </Typography>

        {/* 2. FILTROS */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#737373",
              mr: 0.5,
            }}
          >
            Filtrar por:
          </Typography>

          {filters.map((item) => {
            const isActive = filter === item.label;
            return (
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
                  height: "40px",
                  minWidth: "130px",
                  justifyContent: "center",
                  borderRadius: "12px",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "14px",
                  transition: "0.2s ease",
                  backgroundColor: isActive ? "#029739" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#737373",
                  border: isActive ? "1px solid #029739" : "1px solid #E7E5E4",
                  boxShadow: isActive
                    ? "0px 1px 2px rgba(0, 0, 0, 0.05)"
                    : "none",
                  "& .MuiChip-icon": {
                    color: isActive ? "#FFFFFF" : "#737373",
                    fontSize: "18px",
                  },
                  "&:hover": {
                    backgroundColor: isActive ? "#15803d" : "#F5F5F4",
                  },
                }}
              />
            );
          })}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            marginTop: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <HistoryIcon sx={{ color: "#171717", fontSize: 22 }} />
            <Typography
              sx={{ fontWeight: 700, fontSize: "20px", color: "#171717" }}
            >
              Actividad reciente
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 3,
                    pb: 3,
                    borderBottom: index !== 4 ? "1px solid #E7E5E4" : "none",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Skeleton
                      variant="rounded"
                      width={42}
                      height={42}
                      sx={{ borderRadius: "10px" }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton width="40%" height={28} />
                      <Skeleton width="20%" height={20} />
                      <Skeleton width="30%" height={20} sx={{ mt: 1 }} />
                    </Box>
                  </Box>
                </Box>
              ))
            ) : currentItems.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 6,
                }}
              >
                <EmptyState
                  icon={HistoryIcon}
                  title="Sin actividad reciente"
                  description="No se ha registrado ninguna operación por el momento."
                />
              </Box>
            ) : (
              currentItems.map((item, index) => {
                const { icon, iconBg, iconColor } = resolveIcon(item.iconType);

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
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
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
        </Box>
      </Box>
    </MainLayout>
  );
};

export default History;
