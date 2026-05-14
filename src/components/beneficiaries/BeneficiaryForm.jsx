import {Box, Button, Typography, Dialog, DialogContent, TextField,} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const BeneficiaryForm = ({ open, setOpen }) => {
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
          Registrar Nueva Familia
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
          Nombre de la Familia
        </Typography>
        <TextField fullWidth sx={{ marginBottom: 3, marginTop: 1 }} />

        <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Numero de Telefono
            </Typography>
            <TextField fullWidth sx={{ marginTop: 1 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Cantidad de Miembros
            </Typography>
            <TextField type="number" fullWidth defaultValue={0} sx={{ marginTop: 1 }} />
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
          Direccion / Ubicación
        </Typography>
        <TextField
          fullWidth
          sx={{ marginBottom: 4, marginTop: 1 }}
          InputProps={{
            startAdornment: <LocationOnOutlinedIcon sx={{ color: "#9ca3af", marginRight: 1 }} />,
          }}
        />

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
            Registrar Familia
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BeneficiaryForm;