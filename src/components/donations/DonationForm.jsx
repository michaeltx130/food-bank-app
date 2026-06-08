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
import {
  getCategories,
  createDonacion,
  createCategory,
} from "../../services/api";
import AddIcon from "@mui/icons-material/Add";

const DonationForm = ({ open, setOpen, onSuccess }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const [form, setForm] = useState({
    donante_nombre: "",
    producto_nombre: "",
    categoria_id: "",
    cantidad: "",
    unit: "",
  });

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSuccess(false);
    getCategories()
      .then(setCategorias)
      .catch(() => setError("Error al cargar categorías."));
  }, [open]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setError(null);
    setSuccess(false);
    setForm({
      donante_nombre: "",
      producto_nombre: "",
      categoria_id: "",
      cantidad: "",
      unit: "",
    });
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!form.donante_nombre.trim()) {
      return setError("El nombre del donante es requerido.");
    }

    if (!form.producto_nombre.trim()) {
      return setError("El nombre del producto es requerido.");
    }

    if (!form.cantidad) {
      return setError("La cantidad es obligatoria.");
    }

    if (Number(form.cantidad) <= 0) {
      return setError("La cantidad debe ser mayor a 0.");
    }

    if (!Number.isInteger(Number(form.cantidad))) {
      return setError("La cantidad debe ser un número entero.");
    }

    if (!form.unit) {
      return setError("Selecciona una unidad.");
    }

    setLoading(true);
    setError(null);

    try {
      await createDonacion({
        donante: form.donante_nombre.trim(),
        producto: form.producto_nombre.trim(),
        cantidad: Number(form.cantidad),
        unit: form.unit,
        categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
      });

      setSuccess(true);
      onSuccess?.();
      setTimeout(handleClose, 1200);
    } catch {
      setError("Error al registrar la donación. Intenta de nuevo.");
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

      setCategorias((prev) => [...prev, category]);

      setForm((prev) => ({
        ...prev,
        categoria_id: category.id,
      }));

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
        onClose={loading ? undefined : handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "32px", padding: 2 } }}
      >
        <DialogContent>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#171717", marginBottom: 4 }}
          >
            Registrar Donación
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              ¡Donación registrada!
            </Alert>
          )}

          <TextField
            fullWidth
            label="Donante"
            placeholder="Nombre del donante"
            name="donante_nombre"
            value={form.donante_nombre}
            onChange={handleChange}
            sx={{ marginBottom: 3 }}
          />

          <TextField
            fullWidth
            label="Producto"
            placeholder="Alimento/producto"
            name="producto_nombre"
            value={form.producto_nombre}
            onChange={handleChange}
            sx={{ marginBottom: 3 }}
          />

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

          <TextField
            fullWidth
            select
            label="Categoría"
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            sx={{ marginBottom: 3 }}
          >
            <MenuItem value="">Sin categoría</MenuItem>
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </MenuItem>
            ))}
          </TextField>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              marginBottom: 4,
            }}
          >
            <TextField
              fullWidth
              label="Cantidad"
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              select
              label="Unidad"
              name="unit"
              value={form.unit}
              onChange={handleChange}
            >
              <MenuItem value="pz">Pz</MenuItem>
              <MenuItem value="kg">Kg</MenuItem>
              <MenuItem value="gr">Gramos</MenuItem>
              <MenuItem value="L">Litros</MenuItem>
              <MenuItem value="ml">Mililitros</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
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
                "&:hover": { backgroundColor: "#EA580C" },
              }}
            >
              Registrar donación
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>

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
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
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

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setCategoryModalOpen(false);
                setNewCategory("");
                setCategoryError("");
              }}
            >
              Cancelar
            </Button>

            <LoadingButton
              fullWidth
              loading={categoryLoading}
              disabled={categoryLoading}
              onClick={handleCreateCategory}
              variant="contained"
              sx={{
                backgroundColor: "#F97316",
                "&:hover": { backgroundColor: "#EA580C" },
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

export default DonationForm;
