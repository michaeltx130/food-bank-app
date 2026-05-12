import React from "react";
import { useNavigate } from "react-router-dom";

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
  // 🔹 Opciones del menú
  const navigate = useNavigate();
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Inventario", icon: <InventoryIcon />, path: "/inventory" },
    { text: "Red de Inventarios", icon: <NetworkIcon />, path: "/network" },
    { text: "Solicitudes", icon: <RequestIcon />, path: "/requests" },
    { text: "Donaciones", icon: <DonationIcon />, path: "/" },
    { text: "Beneficiarios", icon: <BeneficiaryIcon />, path: "/" },
    { text: "Historial", icon: <HistoryIcon />, path: "/" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          height: "100vh",
          width: 260,
          boxSizing: "border-box",
          backgroundColor: "#16a34a",
          color: "#ffffff",
          border: "none",
          overflow: "hidden",
        },
      }}
    >
      {/* Contenedor principal del sidebar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
          overflow: "hidden",
        }}
      >
        <Box>
          {/* Logo y sucursal */}
          <Box
            sx={{
              marginBottom: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: "Regular", opacity: 0.8 }}
            >
              Tu Sucursal
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
              }}
            >
              La Paz
            </Typography>
          </Box>

          <Divider
            sx={{ borderColor: "rgba(255,255,255,0.2)", marginBottom: 2 }}
          />

          {/* Menú de opciones */}
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 3,
                  marginBottom: 1,

                  "&.Mui-selected": {
                    backgroundColor: "#15803d",
                  },

                  "&.Mui-selected:hover": {
                    backgroundColor: "#166534",
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
                  {item.icon}
                </ListItemIcon>

                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Parte inferior
        <Box
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
        </Box>*/}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
