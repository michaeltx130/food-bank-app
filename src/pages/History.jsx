import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Pagination,
  CircularProgress,
  Chip,
} from "@mui/material";
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
import { getDonaciones, getEntregas, getTransferencias } from "../services/api";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todas");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const [donaciones, entregas, transferencias] = await Promise.all([
          getDonaciones(),
          getEntregas(),
          getTransferencias(),
        ]);

        const historialDonaciones = donaciones.map((d) => ({
          type: "Donaciones",
          title: "Donación recibida",
          icon: <VolunteerActivism />,
          iconBg: "#DCFCE7",
          iconColor: "#16A34A",
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
          icon: <Inventory2 />,
          iconBg: "#FEF3C7",
          iconColor: "#D97706",
          details: [
            `Producto: ${e.producto?.nombre ?? "Sin producto"}`,
            `Cantidad: ${e.cantidad} ${e.producto?.unit ?? ""}`,
            `Beneficiario: ${e.beneficiario?.nombre ?? "Sin nombre"}`,
          ],
          date: e.fecha,
        }));

        const historialTransferencias = transferencias.map((t) => {
          const currentNode = import.meta.env.VITE_CURRENT_NODE;
          const esRecibida =
            t.destino?.toLowerCase() === currentNode.toLowerCase();

          return {
            type: "Solicitudes",
            title: esRecibida
              ? `Solicitud recibida de ${t.origen}`
              : `Solicitud enviada a ${t.destino}`,
            icon: esRecibida ? <CallReceived /> : <CallMade />,
            iconBg: esRecibida ? "#EDE9FE" : "#DBEAFE",
            iconColor: esRecibida ? "#7C3AED" : "#2563EB",
            details: [
              `Producto: ${t.producto_nombre}`,
              `Cantidad: ${t.cantidad}`,
              `Estado: ${t.estado}`,
            ],
            status: t.estado,
            date: t.created_at,
          };
        });

        const merged = [
          ...historialDonaciones,
          ...historialEntregas,
          ...historialTransferencias,
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(merged);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    if (filter === "Todas") {
      return history;
    }
    return history.filter((item) => item.type === filter);
  }, [history, filter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredHistory.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const filters = [
    {
      label: "Todas",
      icon: (
        <HistoryIcon
          sx={{
            fontSize: 18,
          }}
        />
      ),
    },

    {
      label: "Donaciones",
      icon: (
        <VolunteerActivism
          sx={{
            fontSize: 18,
          }}
        />
      ),
    },

    {
      label: "Solicitudes",
      icon: (
        <Email
          sx={{
            fontSize: 18,
          }}
        />
      ),
    },

    {
      label: "Entregas",
      icon: (
        <Inventory2
          sx={{
            fontSize: 18,
          }}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          padding: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          backgroundColor: "#F9FAFB",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: 4,
            color: "#171717",
          }}
        >
          Historial
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "1fr",
            },
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
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
            icon={
              <HistoryIcon
                sx={{
                  color: "#7C3AED",
                }}
              />
            }
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {currentItems.map((item, index) => (
                <HistoryCard
                  key={index}
                  {...item}
                  isLast={index === currentItems.length - 1}
                />
              ))}
            </Box>

            {totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
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
