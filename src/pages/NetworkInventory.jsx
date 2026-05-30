import React, { useState, useMemo, useEffect } from "react";

import {
  Box,
  Typography,
  Paper,
  Pagination,
  CircularProgress,
} from "@mui/material";

import Sidebar from "../components/layout/Sidebar";
import SearchBar from "../components/inventory/SearchBar";
import InventoryTable from "../components/inventory/InventoryTable";
import RequestProductModal from "../components/network/RequestProductModal";
import BranchSelector from "../components/network/BranchSelector";
import { getBranchProducts } from "../services/api";

const NetworkInventory = () => {
  //Nodo actual
  const CURRENT_NODE = import.meta.env.VITE_CURRENT_NODE;

  //Todas las sucursales
  const allBranches = [
    { id: 1, key: "lapaz", branchName: "La Paz" },
    { id: 2, key: "comondu", branchName: "Comondú" },
    { id: 3, key: "loreto", branchName: "Loreto" },
    { id: 4, key: "mulege", branchName: "Mulegé" },
  ];

  //Excluir nodo actual del selector
  const availableBranches = useMemo(
    () => allBranches.filter((branch) => branch.key !== CURRENT_NODE),
    [CURRENT_NODE],
  );

  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [branchProducts, setBranchProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const productsPerPage = 5;

  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Guardamos el objeto completo de la sucursal seleccionada para tener
  // tanto el nombre para mostrar como la clave (key) para la API.
  const [selectedBranchForModal, setSelectedBranchForModal] = useState(null);

  //Inicializar selector
  useEffect(() => {
    if (availableBranches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(availableBranches[0].id);
    }
  }, [availableBranches, selectedBranchId]);

  const selectedBranchData = useMemo(
    () => availableBranches.find((branch) => branch.id === selectedBranchId),
    [selectedBranchId, availableBranches],
  );

  const fetchProducts = async () => {
    if (!selectedBranchData) return;
    try {
      setLoading(true);
      setError("");

      const data = await getBranchProducts(selectedBranchData.key);
      const formattedProducts = data.map((product) => ({
        id: product.id,
        name: product.nombre ?? "Sin nombre",
        category: product.categoria?.nombre || "Sin categoría",
        quantity: product.cantidad,
        unit: product.unit,
      }));

      setBranchProducts(formattedProducts);
    } catch (err) {
      console.error(err);
      setError("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };
  //Obtener productos al cambiar de sucursal
  useEffect(() => {
    fetchProducts();
  }, [selectedBranchData]);

  const filteredProducts = useMemo(
    () =>
      branchProducts.filter((product) =>
        (product.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [branchProducts, searchTerm],
  );

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  //Cambiar sucursal en el selector
  const handleBranchChange = (event) => {
    setSelectedBranchId(event.target.value);
    setPage(1);
    setSearchTerm("");
  };

  //Abrir modal — guardamos el producto y la sucursal completa
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setSelectedBranchForModal(selectedBranchData); // { id, key, branchName }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
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
            gap: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#171717" }}>
            Red de Inventarios
          </Typography>

          <BranchSelector
            branches={availableBranches}
            selectedBranch={selectedBranchId}
            onChange={handleBranchChange}
          />
        </Box>

        {/* Buscador */}
        <Box sx={{ marginBottom: 3 }}>
          <SearchBar
            placeholder="Buscar productos"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </Box>

        {/* Tabla */}
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

          {loading ? (
            <Box
              sx={{ display: "flex", justifyContent: "center", paddingY: 8 }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ paddingY: 8, textAlign: "center" }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <>
              <InventoryTable
                products={paginatedProducts}
                showRequestButton
                onRequest={handleOpenModal}
                branchName={selectedBranchData?.branchName}
              />
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
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Paper>

        {/* Modal de solicitud */}
        <RequestProductModal
          open={openModal}
          handleClose={handleCloseModal}
          product={selectedProduct}
          branchName={selectedBranchForModal?.branchName}
          sourceBranchKey={selectedBranchForModal?.key}
          onSuccessTransfer={fetchProducts}
        />
      </Box>
    </Box>
  );
};

export default NetworkInventory;
