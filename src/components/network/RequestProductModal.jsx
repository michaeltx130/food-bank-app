import React from "react";

import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";

const RequestProductModal = ({ open, handleClose, product, branchName }) => {
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
          sx={{
            fontSize: "38px",
            fontWeight: "Bold",
            color: "#171717",
            marginBottom: 4,
          }}
        >
          Solicitar Producto
        </Typography>

        {/* Branch */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography
            sx={{
              fontWeight: "Bold",
              color: "#525252",
              marginBottom: 1,
            }}
          >
            Solicitando a:
          </Typography>

          <Typography
            sx={{
              fontWeight: "Bold",
              fontSize: "28px",
              color: "#171717",
            }}
          >
            {branchName}
          </Typography>
        </Box>

        {/* Producto */}
        <TextField
          fullWidth
          label="Producto"
          value={product?.name || ""}
          disabled
          sx={{ marginBottom: 3 }}
        />

        {/* Quantity + Unit */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            marginBottom: 3,
          }}
        >
          <TextField fullWidth label="Cantidad" type="number" />

          <TextField
            fullWidth
            label="Unidad"
            value={product?.unit || ""}
            disabled
          />
        </Box>

        {/* Reason */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Motivo de la solicitud"
          placeholder="Explica brevemente por qué necesitas este producto..."
          sx={{ marginBottom: 4 }}
        />

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

              "&:hover": {
                backgroundColor: "#EA580C",
              },
            }}
          >
            Enviar Solicitud
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RequestProductModal;
