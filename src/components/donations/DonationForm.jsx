import { useState } from "react";
import {
  Dialog, DialogContent, Typography, Box,
  TextField, Button, MenuItem, Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { createDonacion } from "../../services/api";

const DonationForm = ({ open, setOpen, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    donante_nombre: "",
    producto_nombre: "",  // ← texto libre, ya no producto_id
    cantidad: "",
    unit: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setError(null);
    setSuccess(false);
    setForm({ donante_nombre: "", producto_nombre: "", cantidad: "", unit: "" });
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!form.donante_nombre.trim())  return setError("El nombre del donante es requerido.");
    if (!form.producto_nombre.trim()) return setError("El nombre del producto es requerido.");
    if (Number(form.cantidad) <= 0)   return setError("La cantidad debe ser mayor a 0.");
    if (!form.unit)                   return setError("Selecciona una unidad.");

    setLoading(true);
    setError(null);

    try {
      await createDonacion({
        donante:  form.donante_nombre.trim(),
        producto: form.producto_nombre.trim(),  // ← nombre libre
        cantidad: Number(form.cantidad),
        unit:     form.unit,
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "32px", padding: 2 } }}
    >
      <DialogContent>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#171717", marginBottom: 4 }}>
          Registrar Donación
        </Typography>

        {error   && <Alert severity="error"   sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>¡Donación registrada!</Alert>}

        {/* Donante */}
        <TextField
          fullWidth
          label="Donante"
          placeholder="Nombre del donante"
          name="donante_nombre"
          value={form.donante_nombre}
          onChange={handleChange}
          sx={{ marginBottom: 3 }}
        />

        {/* Producto — texto libre, igual que AddProductModal */}
        <TextField
          fullWidth
          label="Producto"
          placeholder="Alimento/producto"
          name="producto_nombre"
          value={form.producto_nombre}
          onChange={handleChange}
          sx={{ marginBottom: 3 }}
        />

        {/* Cantidad + Unidad */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 4 }}>
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
            fullWidth select
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

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth variant="outlined"
            onClick={handleClose}
            sx={{ borderRadius: "16px", paddingY: 1.5, textTransform: "none" }}
          >
            Cancelar
          </Button>
          <LoadingButton
            fullWidth variant="contained"
            loading={loading}
            disabled={loading}
            onClick={handleSubmit}
            sx={{
              borderRadius: "16px", paddingY: 1.5, textTransform: "none",
              backgroundColor: "#F97316",
              "&:hover": { backgroundColor: "#EA580C" },
            }}
          >
            Registrar donación
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DonationForm;