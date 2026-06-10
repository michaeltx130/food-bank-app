import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.jpeg";
import Badge from "@mui/material/Badge";
import { getResumenNotificaciones } from "../../services/api";

import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Public as NetworkIcon,
  Mail as RequestIcon,
  VolunteerActivism as DonationIcon,
  People as BeneficiaryIcon,
  History as HistoryIcon,
  SyncAlt as SwitchIcon,
} from "@mui/icons-material";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificaciones, setNotificaciones] = useState(0);

  const CURRENT_NODE = import.meta.env.VITE_CURRENT_NODE;
  const branchNames = {
    lapaz: "La Paz",
    comondu: "Comondú",
    loreto: "Loreto",
    mulege: "Mulegé",
  };

  const currentBranch = branchNames[CURRENT_NODE] || "Sucursal";

  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const data = await getResumenNotificaciones();
        setNotificaciones(data.no_leidas || 0);
      } catch (error) {
        console.error(error);
      }
    };

    cargarNotificaciones();

    const interval = setInterval(cargarNotificaciones, 5000);

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Inventario", icon: <InventoryIcon />, path: "/inventory" },
    { text: "Red de Inventarios", icon: <NetworkIcon />, path: "/network" },
    { text: "Solicitudes", icon: <RequestIcon />, path: "/requests" },
    { text: "Donaciones", icon: <DonationIcon />, path: "/donations" },
    {
      text: "Beneficiarios",
      icon: <BeneficiaryIcon />,
      path: "/beneficiaries",
    },
    { text: "Historial", icon: <HistoryIcon />, path: "/history" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
          backgroundColor: "#16a34a",
          color: "#ffffff",
          border: "none",
          overflow: "hidden",
          borderRadius: "1px",

          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          p: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              objectFit: "cover",
              backgroundColor: "white",
              p: 0.5,
            }}
          />
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Tu Sucursal
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {currentBranch}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />

        {/* Menú principal */}
        <List sx={{ flex: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
                "&:hover": {
                  backgroundColor: "#15803d",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#ffffff",
                  minWidth: 40,
                }}
              >
                {item.text === "Solicitudes" ? (
                  <Badge badgeContent={notificaciones} color="error" max={99}>
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>

        {/* Parte inferior */}
        {/* <Box
          sx={{
            marginTop: "auto",
          }}
        >
          <Divider
            sx={{ borderColor: "rgba(255,255,255,0.2)", marginBottom: 1 }}
          />
          <ListItemButton
            sx={{
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#15803d",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "#ffffff",
                minWidth: 40,
              }}
            >
              <SwitchIcon />
            </ListItemIcon>

            <ListItemText primary="Cambiar sucursal" />
          </ListItemButton>
        </Box> */}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
