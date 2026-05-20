import React, { useState, useMemo } from "react";

import { Box, Typography, Button, Paper, Pagination } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import Sidebar from "../components/layout/Sidebar";
import SearchBar from "../components/inventory/SearchBar";
import InventoryTable from "../components/inventory/InventoryTable";
import AddProductModal from "../components/inventory/AddProductModal";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  //Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [openModal, setOpenModal] = useState(false);
  //Los productos vendrán del backend
  const products = [
    {
      id: 1,
      name: "Arroz",
      quantity: 100,
      unit: "kg",
      category: "Granos",
    },
    {
      id: 2,
      name: "Frijoles",
      quantity: 50,
      unit: "kg",
      category: "Granos",
    },
    {
      id: 3,
      name: "Frijoles",
      quantity: 50,
      unit: "kg",
      category: "Granos",
    },
    {
      id: 4,
      name: "Frijoles",
      quantity: 50,
      unit: "kg",
      category: "Granos",
    },
    {
      id: 5,
      name: "Frijoles",
      quantity: 50,
      unit: "kg",
      category: "Granos",
    },
    {
      id: 6,
      name: "Frijoles",
      quantity: 50,
      unit: "kg",
      category: "Granos",
    },
    {
      id: 7,
      name: "Frijoles",
      quantity: 50,
      unit: "kg",
      category: "Granos",
    },
    {
      id: 8,
      name: "Manzana",
      quantity: 50,
      unit: "kg",
      category: "Frutas y Verduras",
    },
  ];

  //Productos filtrados
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, products]);

  //Lógica de paginación
  const startIndex = (currentPage - 1) * productsPerPage;

  const endIndex = startIndex + productsPerPage;

  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  //Páginas totales
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
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
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          backgroundColor: "#F9FAFB",
          overflowY: "auto",
        }}
      >
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
              fontWeight: 700,
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
              "&:hover": {
                backgroundColor: "#EA580C",
              },
            }}
          >
            Agregar Producto
          </Button>
        </Box>
        <Paper
          sx={{
            padding: 3,
            borderRadius: "24px",
            border: "0.5px solid #E7E5E4",
            boxShadow: "0px 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InventoryTable products={currentProducts} />

          {/* Paginación */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 3,
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
        </Paper>
        {/* Modal */}
        <AddProductModal open={openModal} handleClose={handleClose} />
      </Box>
    </Box>
  );
};

export default Inventory;
