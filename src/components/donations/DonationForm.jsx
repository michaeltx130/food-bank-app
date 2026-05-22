import { useState, useEffect } from "react";
import {Box, Button, Typography, Dialog, DialogContent,TextField, MenuItem, CircularProgress, Alert} from "@mui/material";
import { getProducts, createDonacion } from "../../services/api";

const DonationForm = ({ open, setOpen, onSuccess }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(false);

  const [form, setForm] = useState({
    donante_nombre: "",
    producto_id:    "",
    cantidad:       "",
  });

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSuccess(false);
    getProducts().then(setProductos).catch(() => setError("Error al cargar productos."));
  }, [open]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.donante_nombre.trim()) return setError("El nombre del donante es requerido.");
    if (!form.producto_id)           return setError("Selecciona un producto.");
    if (Number(form.cantidad) <= 0)  return setError("La cantidad debe ser mayor a 0.");

    setLoading(true);
    setError(null);

   try {
  await createDonacion({
    donante:     form.donante_nombre.trim(),
    producto_id: Number(form.producto_id),
    cantidad:    Number(form.cantidad),
  });

  setSuccess(true);
  onSuccess?.();        
  setTimeout(() => {
    setOpen(false);
    setForm({ donante_nombre: "", producto_id: "", cantidad: 0 });
    setSuccess(false);
  }, 1200);

    } catch {
      setError("Error al registrar la donación. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "24px" } }}
    >
      <DialogContent sx={{ padding: "40px" }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Registrar Donacion
        </Typography>

        {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Donación registrada!</Alert>}

        <Typography variant="caption" color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
          Donante
        </Typography>
        <TextField
          fullWidth name="donante_nombre"
          value={form.donante_nombre}
          onChange={handleChange}
          placeholder="Nombre del donante"
          sx={{ mb: 3, mt: 1 }}
        />

        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary"
              sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Producto
            </Typography>
            <TextField
              select fullWidth name="producto_id"
              value={form.producto_id}
              onChange={handleChange}
              sx={{ mt: 1 }}
            >
              {productos.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ width: "200px" }}>
            <Typography variant="caption" color="text.secondary"
              sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Cantidad estimada (kg)
            </Typography>
            <TextField
              type="number" fullWidth name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth variant="outlined"
            onClick={() => setOpen(false)}
            disabled={loading}
            sx={{ borderRadius: 3, textTransform: "none", py: 1.5 }}
          >
            Cancelar
          </Button>
          <Button
            fullWidth variant="contained" color="warning"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ borderRadius: 3, textTransform: "none", py: 1.5 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Registrar donacion"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DonationForm;