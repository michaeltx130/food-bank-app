import React, { useState } from "react";

import { Box, Typography, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Sidebar from "../components/layout/Sidebar";
import SearchBar from "../components/inventory/SearchBar";
import InventoryTable from "../components/inventory/InventoryTable";
import AddProductModal from "../components/inventory/AddProductModal";

const Inventory = () => {
  const products = [

  ];

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          backgroundColor: "#F9FAFB",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#171717",
            }}
          >
            Inventario
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{
              backgroundColor: "#F97316",
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 600,
              paddingX: 3,
              paddingY: 1.2,
            }}
          >
            Agregar Producto
          </Button>
        </Box>

        {/* Table Container */}
        <Paper
          sx={{
            padding: 3,
            borderRadius: "24px",
            border: "0.5px solid #E7E5E4",
            boxShadow: "0px 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <SearchBar />
          <InventoryTable products={products} />
        </Paper>

        {/* Modal */}
        <AddProductModal open={openModal} handleClose={handleClose} />
      </Box>
    </Box>
  );
};

export default Inventory;
