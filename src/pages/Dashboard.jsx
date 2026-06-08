import React, { useEffect, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import { Box, Typography } from "@mui/material";
import { Inventory2, People, Mail, Warning } from "@mui/icons-material";
import StatCard from "../components/dashboard/StatCard";
import InfoPanel from "../components/dashboard/InfoPanel";
import {
  getProducts,
  getBeneficiarios,
  getSolicitudesRecibidas,
} from "../services/api";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [productsData, familiasData, solicitudesData] = await Promise.all(
          [
            getProducts(),
            getBeneficiarios(),
            // getSolicitudesRecibidas(),
          ],
        );

        setProducts(productsData);
        setFamilias(familiasData);
        // setSolicitudes(solicitudesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const stockBajo = products.filter((p) => p.cantidad > 0 && p.cantidad <= 10);

  const solicitudesPendientes = solicitudes.filter(
    (s) => s.estado === "PENDIENTE",
  );
  const stats = [
    {
      title: "Productos en Stock",
      value: loading ? "..." : products.filter((p) => p.cantidad > 0).length,
      description: "productos totales",
      icon: <Inventory2 />,
      iconBg: "#FFF1E6",
      iconColor: "#F97316",
    },

    {
      title: "Familias Registradas",
      value: loading ? "..." : familias.length,
      description: "beneficiarios registrados",
      icon: <People />,
      iconBg: "#EFF6FF",
      iconColor: "#3b82f6",
    },

    {
      title: "Solicitudes Recibidas",
      value: loading ? "..." : solicitudesPendientes.length,
      description: "pendientes de respuesta",
      icon: <Mail />,
      iconBg: "#FFF7ED",
      iconColor: "#EA580C",
    },

    {
      title: "Stock Bajo",
      value: loading ? "..." : stockBajo.length,
      description: "productos por reabastecer",
      icon: <Warning />,
      iconBg: "#FEF2F2",
      iconColor: "#E11D48",
    },
  ];
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      {/* Contenedor principal del dashboard */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          backgroundColor: "#F9FAFB",
          height: "100vh",
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
          Dashboard
        </Typography>

        {/* Contenedor para las tarjetas de estadísticas */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },

            gap: 3,
            width: "100%",
          }}
        >
          {stats.map((item) => (
            <StatCard
              key={item.title}
              title={item.title}
              value={item.value}
              description={item.description}
              icon={item.icon}
              iconBg={item.iconBg}
              iconColor={item.iconColor}
            />
          ))}
        </Box>
        {/*Contenedor para los paneles*/}
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              lg: "1fr 1fr",
            },

            gap: 3,
            marginTop: 4,
          }}
        >
          {/*Paneles de Stock Bajo y Solicitudes por responder*/}
          <InfoPanel
            title={`Productos con Stock Bajo (${stockBajo.length})`}
            icon={<Warning sx={{ color: "#E11D48" }} />}
            maxHeight={220}
          >
            <Box>
              {stockBajo.map((p) => (
                <Box
                  key={p.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.2,
                    borderBottom: "1px solid #F5F5F4",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#171717",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {p.nombre}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      whiteSpace: "nowrap",

                      color:
                        p.cantidad === 0
                          ? "#dc2626"
                          : p.cantidad <= 5
                            ? "#DC2626"
                            : "#f97316",
                    }}
                  >
                    {p.cantidad} {p.unit}
                  </Typography>
                </Box>
              ))}
            </Box>
          </InfoPanel>

          <InfoPanel
            title={`Solicitudes por Responder (${solicitudesPendientes.length})`}
            icon={
              <Mail
                sx={{
                  color: "#EA580C",
                }}
              />
            }
            maxHeight={220}
          >
            {solicitudesPendientes.length === 0 ? (
              <Typography color="text.secondary">
                No hay solicitudes pendientes.
              </Typography>
            ) : (
              <>
                {solicitudesPendientes.map((s) => (
                  <Box
                    key={s.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <Typography>{s.producto_nombre}</Typography>

                    <Box
                      sx={{
                        backgroundColor: "#f3f4f6",
                        px: 1.2,
                        py: 0.3,
                        borderRadius: 2,
                        fontSize: "12px",
                        color: "#6b7280",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {s.origen}
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </InfoPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
