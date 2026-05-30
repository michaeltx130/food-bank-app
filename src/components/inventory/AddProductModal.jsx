import React from "react";
import { useState, useEffect, useRef } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import {
  createProduct,
  getCategories,
  createCategory,
} from "../../services/api";

const AddProductModal = ({ open, handleClose, onProductCreated }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const submitLock = useRef(false);

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

  const resetForm = () => {
    setName("");
    setQuantity("");
    setUnit("");
    setCategoryId("");

    setErrors({});
    setSuccess(false);

    setNewCategory("");
    setCategoryError("");
    setCategoryModalOpen(false);
  };

  const handleModalClose = () => {
    submitLock.current = false;
    resetForm();
    handleClose();
  };

  const handleSubmit = async () => {
    if (loading || submitLock.current) return;

    submitLock.current = true;

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
      submitLock.current = false;
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
        handleModalClose();
        submitLock.current = false;
      }, 500);
    } catch (error) {
      console.error(error);
      submitLock.current = false;
    } finally {
      setLoading(false);
    }
  };
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      setCategoryError("Ingresa un nombre");
      return;
    }

    try {
      setCategoryLoading(true);
      setCategoryError("");

      const category = await createCategory(newCategory.trim());

      setCategories((prev) => [...prev, category]);

      setCategoryId(category.id);

      setNewCategory("");
      setCategoryModalOpen(false);
    } catch (error) {
      console.error(error);
      setCategoryError("Error creando categoría");
    } finally {
      setCategoryLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={loading ? undefined : handleModalClose}
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

          {/* Agregar categoría */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 1,
            }}
          >
            <Button
              startIcon={<AddIcon />}
              onClick={() => setCategoryModalOpen(true)}
              sx={{
                textTransform: "none",
                color: "#E07A2F",
                padding: 0,

                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Agregar categoría
            </Button>
          </Box>

          {/* Categoría */}
          <TextField
            fullWidth
            select
            label="Categoría"
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
              error={!!errors.quantity}
              helperText={errors.quantity}
              inputProps={{ min: 1 }}
            />

            <TextField
              fullWidth
              select
              label="Unidad"
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

          {/* Botones */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={handleModalClose}
              disabled={loading}
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

      {/* Modal Nueva Categoría */}
      <Dialog
        open={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setNewCategory("");
          setCategoryError("");
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 3,
            }}
          >
            Nueva categoría
          </Typography>

          <TextField
            fullWidth
            label="Nombre"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              setCategoryError("");
            }}
            error={!!categoryError}
            helperText={categoryError}
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setCategoryModalOpen(false);
                setNewCategory("");
                setCategoryError("");
              }}
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
              loading={categoryLoading}
              onClick={handleCreateCategory}
              variant="contained"
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
              Agregar categoría
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddProductModal;