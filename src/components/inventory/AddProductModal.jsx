import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { createProduct, getCategories } from "../../services/api";

const AddProductModal = ({ open, handleClose, onProductCreated }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const createdProduct = await createProduct({
        nombre: name,
        categoria_id: Number(categoryId),
        cantidad: Number(quantity),
        unit,
      });

      const formattedProduct = {
        id: createdProduct.id,
        name: createdProduct.nombre,
        category:
          categories.find((cat) => cat.id === Number(categoryId))?.nombre ||
          "Sin categoría",
        quantity: createdProduct.cantidad,
        //luego esto vendrá del backend
        unit: createdProduct.unit,
      };

      onProductCreated(formattedProduct);

      handleClose();

      setName("");
      setQuantity("");
      setUnit("");
      setCategoryId("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "32px",
          padding: 2,
        },
      }}
    >
      <DialogContent>
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#171717",
            marginBottom: 4,
          }}
        >
          Agregar Producto
        </Typography>

        {/* Producto */}
        <TextField
          fullWidth
          label="Producto"
          placeholder="Alimento/producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ marginBottom: 3 }}
        />

        {/* Cantidad + Unidad */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            marginBottom: 3,
          }}
        >
          <TextField
            fullWidth
            label="Cantidad"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <TextField
            fullWidth
            select
            label="Unidad"
            defaultValue=""
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <MenuItem value="pz">Pz</MenuItem>
            <MenuItem value="kg">Kg</MenuItem>
            <MenuItem value="gr">Gramos</MenuItem>
            <MenuItem value="L">Litros</MenuItem>
            <MenuItem value="ml">Mililitros</MenuItem>
          </TextField>
        </Box>

        {/* Categoría */}
        <TextField
          fullWidth
          select
          label="Categoría"
          defaultValue=""
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          sx={{ marginBottom: 4 }}
        >
          {/*Las categorias vienen del backend*/}
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.nombre}
            </MenuItem>
          ))}
        </TextField>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderRadius: "16px",
              paddingY: 1.5,
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>

          <LoadingButton
            fullWidth
            variant="contained"
            loading={loading}
            disabled={loading}
            onClick={handleSubmit}
            sx={{
              borderRadius: "16px",
              paddingY: 1.5,
              textTransform: "none",
              backgroundColor: "#F97316",
              "&:hover": {
                backgroundColor: "#EA580C",
              },
            }}
          >
            Agregar producto
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
