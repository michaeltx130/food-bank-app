import React, { useState, useMemo } from "react";

import { Box, Typography, Paper, Pagination } from "@mui/material";

import Sidebar from "../components/layout/Sidebar";
import SearchBar from "../components/inventory/SearchBar";
import InventoryTable from "../components/inventory/InventoryTable";
import RequestProductModal from "../components/network/RequestProductModal";
import BranchSelector from "../components/network/BranchSelector";

const NetworkInventory = () => {
  //Nodo actual, aquí se detectará desde el backend (supongo) que sucursal es.
  //quiero creer que con la IP
  const currentNode = "La Paz";

  //Los productos vendrán del backend
  const branches = [
    {
      id: 1,
      branchName: "Loreto",
      products: [
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
      ],
    },
    {
      id: 2,
      branchName: "Comondú",
      products: [
        {
          id: 3,
          name: "Leche",
          quantity: 20,
          unit: "L",
          category: "Lácteos",
        },
      ],
    },
    {
      id: 3,
      branchName: "Mulegé",
      products: [
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
      ],
    },
  ];

  //Excluir nodo actual
  const availableBranches = useMemo(() => {
    return branches.filter((branch) => branch.branchName !== currentNode);
  }, []);

  //Selector de sucursal
  const [selectedBranchId, setSelectedBranchId] = useState(
    availableBranches[0]?.id || "",
  );

  const [searchTerm, setSearchTerm] = useState("");
  //Paginación
  const [page, setPage] = useState(1);
  const productsPerPage = 5;
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");

  const selectedBranchData = useMemo(() => {
    return availableBranches.find((branch) => branch.id === selectedBranchId);
  }, [selectedBranchId, availableBranches]);

  //Productos filtrados
  const filteredProducts = useMemo(() => {
    if (!selectedBranchData) return [];

    return selectedBranchData.products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, selectedBranchData]);

  //Lógica de paginación
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * productsPerPage;

    const end = start + productsPerPage;

    return filteredProducts.slice(start, end);
  }, [filteredProducts, page]);

  //Páginas totales
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  //Cambio de sucursal
  const handleBranchChange = (event) => {
    setSelectedBranchId(event.target.value);
    setPage(1);
    setSearchTerm("");
  };

  const handleOpenModal = (product, branchName) => {
    setSelectedProduct(product);
    setSelectedBranch(branchName);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
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
            gap: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#171717",
            }}
          >
            Red de Inventarios
          </Typography>
          <BranchSelector
            branches={availableBranches}
            selectedBranch={selectedBranchId}
            onChange={handleBranchChange}
          />
        </Box>
        <Box
          sx={{
            marginBottom: 3,
          }}
        >
          <SearchBar
            placeholder="Buscar productos"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </Box>
        <Paper
          sx={{
            padding: 3,
            borderRadius: "24px",
            border: "1px solid #E7E5E4",
            boxShadow: "0px 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "24px",
              marginBottom: 3,
              color: "#171717",
            }}
          >
            Productos Totales ({filteredProducts.length})
          </Typography>
          <InventoryTable
            products={paginatedProducts}
            showRequestButton
            onRequest={handleOpenModal}
            branchName={selectedBranchData?.branchName}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 4,
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </Paper>
        <RequestProductModal
          open={openModal}
          handleClose={handleCloseModal}
          product={selectedProduct}
          branchName={selectedBranch}
        />
      </Box>
    </Box>
  );
};

export default NetworkInventory;
