import React from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const AddProductModal = ({ open, handleClose }) => {
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
          <TextField fullWidth label="Cantidad" type="number" />

          <TextField fullWidth select label="Unidad" defaultValue="">
            <MenuItem value="unidad">Unidad(s)</MenuItem>
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
          sx={{ marginBottom: 4 }}
        >
          <MenuItem value="legumbres">Legumbres</MenuItem>
          <MenuItem value="lacteos">Lácteos</MenuItem>
          <MenuItem value="enlatados">Enlatados</MenuItem>
          <MenuItem value="liquidos">Liquidos</MenuItem>
          <MenuItem value="frescos">Frutas y Verduras</MenuItem>
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

          <Button
            fullWidth
            variant="contained"
            sx={{
              borderRadius: "16px",
              paddingY: 1.5,
              textTransform: "none",
              backgroundColor: "#F97316",
            }}
          >
            Agregar producto
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
