import React, { useState, useMemo, useEffect } from "react";

import {
  Box,
  Typography,
  Button,
  Paper,
  Pagination,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import Sidebar from "../components/layout/Sidebar";
import SearchBar from "../components/inventory/SearchBar";
import InventoryTable from "../components/inventory/InventoryTable";
import AddProductModal from "../components/inventory/AddProductModal";
import { getProducts } from "../services/api";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  //Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [openModal, setOpenModal] = useState(false);

  //Los productos vendrán del backend
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        const formattedProducts = data.map((product) => ({
          id: product.id,
          name: product.nombre ?? "Sin nombre",
          category: product.categoria?.nombre || "Sin categoría",
          quantity: product.cantidad,
          //luego esto vendrá del backend
          unit: product.unit,
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error(err);

        setError("Error cargando productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  //Productos filtrados
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    return products.filter((product) =>
      (product.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

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

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">{error}</Typography>
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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
        <AddProductModal
          open={openModal}
          handleClose={handleClose}
          onProductCreated={handleProductCreated}
        />
      </Box>
    </Box>
  );
};

export default Inventory;
