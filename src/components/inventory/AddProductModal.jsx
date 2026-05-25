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
  Alert,
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
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;

    setErrors({});
    setSuccess(false);

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, [open]);

  const handleSubmit = async () => {
    if (loading) return;
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Ingresa el nombre del producto";
    }
    if (!quantity) {
      newErrors.quantity = "Ingresa una cantidad";
    } else if (Number(quantity) <= 0) {
      newErrors.quantity = "La cantidad debe ser mayor a 0";
    }
    if (!unit) {
      newErrors.unit = "Selecciona una unidad";
    }
    if (!categoryId) {
      newErrors.category = "Selecciona una categoría";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setErrors({});
      setSuccess(false);
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

      setSuccess(true);

      setTimeout(() => {
        handleClose();
        setName("");
        setQuantity("");
        setUnit("");
        setCategoryId("");
        setErrors({});
      }, 1200);
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

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ¡Producto agregado correctamente!
          </Alert>
        )}

        {/* Producto */}
        <TextField
          fullWidth
          label="Producto"
          placeholder="Alimento/producto"
          value={name}
          onChange={(e) => {
            setName(e.target.value);

            setErrors((prev) => ({
              ...prev,
              name: "",
            }));
          }}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ marginBottom: 3 }}
        />
        {/* Categoría */}
        <TextField
          fullWidth
          select
          label="Categoría"
          defaultValue=""
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);

            setErrors((prev) => ({
              ...prev,
              category: "",
            }));
          }}
          error={!!errors.category}
          helperText={errors.category}
          sx={{ marginBottom: 4 }}
        >
          {/*Las categorias vienen del backend*/}
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.nombre}
            </MenuItem>
          ))}
        </TextField>
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
            onChange={(e) => {
              setQuantity(e.target.value);
              setErrors((prev) => ({
                ...prev,
                quantity: "",
              }));
            }}
            onWheel={(e) => e.target.blur()}
            error={!!errors.quantity}
            helperText={errors.quantity}
            inputProps={{ min: 1 }}
          />

          <TextField
            fullWidth
            select
            label="Unidad"
            defaultValue=""
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value);

              setErrors((prev) => ({
                ...prev,
                unit: "",
              }));
            }}
            error={!!errors.unit}
            helperText={errors.unit}
          >
            <MenuItem value="pz">Pz</MenuItem>
            <MenuItem value="kg">Kg</MenuItem>
            <MenuItem value="gr">Gramos</MenuItem>
            <MenuItem value="L">Litros</MenuItem>
            <MenuItem value="ml">Mililitros</MenuItem>
          </TextField>
        </Box>

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
