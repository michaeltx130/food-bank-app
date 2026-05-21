import React, { useEffect, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import { Box, Typography } from "@mui/material";
import { Inventory2, People, Mail, Warning } from "@mui/icons-material";
import StatCard from "../components/dashboard/StatCard";
import InfoPanel from "../components/dashboard/InfoPanel";
import { getProducts,  getBeneficiarios } from "../services/api";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
           const [
          productsData,
          familiasData
        ] = await Promise.all([

          getProducts(),
          getBeneficiarios()

        ]);

        setProducts(productsData);
        setFamilias(familiasData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const stats = [
    {
      title: "Productos en Stock",
      value: loading ? "..." : products.length,
      description: "productos totales",
      icon: <Inventory2 />,
      iconBg: "#FFF1E6",
      iconColor: "#F97316",
    },

    {
    title: "Familias Registradas",
    value: loading ? "..." : familias.length,
    description: "beneficiarios registrados",
    },
    
    {
      title: "Solicitudes Recibidas",
      value: 0,
      description: "pendientes de respuesta",
      icon: <Mail />,
      iconBg: "#FFF7ED",
      iconColor: "#EA580C",
    },

    {
      title: "Stock Bajo",
      value: 0,
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
            title="Productos con Stock Bajo"
            icon={<Warning sx={{ color: "#E11D48" }} />}
          >
            <Typography>Información dinamicamente</Typography>
          </InfoPanel>

          <InfoPanel
            title="Solicitudes por Responder"
            icon={<Mail sx={{ color: "#EA580C" }} />}
          >
            <Typography>Información dinamicamente</Typography>
          </InfoPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
