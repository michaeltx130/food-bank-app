import { useState } from "react";
import {Box, Button, Typography, Dialog, DialogContent,TextField, MenuItem, IconButton,} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";

const inventarioDisponible = [
  { id: 1, name: "Arroz", stock: 50, unit: "kg" },
  { id: 2, name: "Frijol", stock: 30, unit: "kg" },
  { id: 3, name: "Atún enlatado", stock: 24, unit: "latas" },
  { id: 4, name: "Aceite", stock: 15, unit: "litros" },
  { id: 5, name: "Harina", stock: 20, unit: "kg" },
];

const DeliveryForm = ({ open, setOpen, family }) => {
  const today = new Date().toISOString().split("T")[0];

  const [fecha, setFecha] = useState(today);
  const [renglones, setRenglones] = useState([
    { productoId: "", cantidad: "" },
  ]);

  const handleAddRenglon = () => {
    setRenglones([...renglones, { productoId: "", cantidad: "" }]);
  };

  const handleRemoveRenglon = (index) => {
    setRenglones(renglones.filter((_, i) => i !== index));
  };

  const handleChangeRenglon = (index, field, value) => {
    const updated = [...renglones];
    updated[index][field] = value;
    setRenglones(updated);
  };

  const productosUsados = renglones.map((r) => r.productoId).filter(Boolean);

  const getProducto = (id) => inventarioDisponible.find((p) => p.id === Number(id));

  const handleClose = () => {
    setRenglones([{ productoId: "", cantidad: "" }]);
    setFecha(today);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "24px" } }}
    >
      <DialogContent sx={{ padding: "40px" }}>
        <Typography variant="h5" fontWeight="bold" mb={0.5}>
          Nueva Entrega
        </Typography>
        <Typography color="text.secondary" fontSize="14px" mb={3}>
          {family?.name}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
          Fecha de entrega
        </Typography>
        <TextField
          type="date"
          fullWidth
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          sx={{ marginTop: 1, marginBottom: 3 }}
        />

        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
          Productos
        </Typography>

        <Box sx={{ marginTop: 1, marginBottom: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {renglones.map((renglon, index) => {
            const productoSeleccionado = getProducto(renglon.productoId);
            const cantidadNum = Number(renglon.cantidad);
            const excede = productoSeleccionado && cantidadNum > productoSeleccionado.stock;

            return (
              <Box key={index} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    select
                    fullWidth
                    value={renglon.productoId}
                    onChange={(e) => handleChangeRenglon(index, "productoId", e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Seleccionar</MenuItem>
                    {inventarioDisponible.map((p) => (
                      <MenuItem
                        key={p.id}
                        value={p.id}
                        disabled={productosUsados.includes(p.id) && renglon.productoId !== p.id}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                          <span>{p.name}</span>
                          <Typography
                            component="span"
                            fontSize="12px"
                            color="text.secondary"
                            sx={{ marginLeft: 2 }}
                          >
                            disponible: {p.stock} {p.unit}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>

                  {excede && (
                    <Typography fontSize="12px" color="error" mt={0.5}>
                      Excede el stock disponible ({productoSeleccionado.stock} {productoSeleccionado.unit})
                    </Typography>
                  )}
                </Box>

                <Box sx={{ width: "110px" }}>
                  <TextField
                    type="number"
                    fullWidth
                    placeholder="0"
                    value={renglon.cantidad}
                    onChange={(e) => handleChangeRenglon(index, "cantidad", e.target.value)}
                    error={excede}
                    InputProps={{
                      endAdornment: productoSeleccionado ? (
                        <Typography fontSize="12px" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                          {productoSeleccionado.unit}
                        </Typography>
                      ) : null,
                    }}
                  />
                </Box>

                <IconButton
                  onClick={() => handleRemoveRenglon(index)}
                  disabled={renglones.length === 1}
                  sx={{ marginTop: 0.5, color: "#9ca3af" }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            );
          })}
        </Box>

        <Button
          startIcon={<AddIcon />}
          onClick={handleAddRenglon}
          sx={{
            textTransform: "none",
            color: "#e07a2f",
            paddingLeft: 0,
            marginBottom: 3,
            "&:hover": { backgroundColor: "transparent", textDecoration: "underline" },
          }}
        >
          Agregar producto
        </Button>


        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClose}
            sx={{ borderRadius: 3, textTransform: "none", paddingY: 1.5 }}
          >
            Cancelar
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            sx={{ borderRadius: 3, textTransform: "none", paddingY: 1.5 }}
          >
            Registrar Entrega
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryForm;