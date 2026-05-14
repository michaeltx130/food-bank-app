import {Box, Button, Typography, Dialog, DialogContent, TextField, MenuItem,} from "@mui/material";

const DonationForm = ({ open, setOpen }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "24px" } }}
    >
      <DialogContent sx={{ padding: "40px" }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Registrar Donacion
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
          Donante
        </Typography>
        <TextField fullWidth sx={{ marginBottom: 3, marginTop: 1 }} />

        <Box sx={{ display: "flex", gap: 2, marginBottom: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Producto
            </Typography>
            <TextField select fullWidth sx={{ marginTop: 1 }}>
              <MenuItem value="Frijol">Frijol</MenuItem>
              <MenuItem value="Arroz">Arroz</MenuItem>
              <MenuItem value="Atún">Atún enlatado</MenuItem>
              <MenuItem value="Aceite">Aceite</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ width: "200px" }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Cantidad estimada (kg)
            </Typography>
            <TextField type="number" fullWidth defaultValue={0} sx={{ marginTop: 1 }} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setOpen(false)}
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
            Registrar donacion
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DonationForm;