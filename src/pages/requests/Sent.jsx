import RequestCard from "../../components/requests/RequestCard";
import {Box,Button,Typography,Dialog,DialogContent,TextField,MenuItem,} from "@mui/material";

const Sent = ({ open, setOpen }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          marginBottom: 8,
        }}
      >
        <RequestCard showActions={false} />
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "40px" },
        }}
      >
        <DialogContent sx={{ padding: "40px" }}>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            Nueva Solicitud
          </Typography>

          <Typography color="text.secondary" mb={4}>
            Completa la información para solicitar productos de otra sucursal.
          </Typography>

          <Typography variant="subtitle2" mb={1}>
            Sucursal de destino
          </Typography>

          <TextField select fullWidth sx={{ marginBottom: 3 }}>
            <MenuItem value="La Paz">La Paz</MenuItem>
            <MenuItem value="Los Cabos">Los Cabos</MenuItem>
            <MenuItem value="Loreto">Loreto</MenuItem>
            <MenuItem value="Mulege">Mulege</MenuItem>
            <MenuItem value="Comondu">Comondu</MenuItem>
          </TextField>

          <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" mb={1}>
                Producto
              </Typography>
              <TextField select fullWidth>
                <MenuItem value="Frijol">Frijol</MenuItem>
                <MenuItem value="Arroz">Arroz</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ width: "180px" }}>
              <Typography variant="subtitle2" mb={1}>
                Cantidad (kg)
              </Typography>
              <TextField type="number" fullWidth />
            </Box>
          </Box>

          <Typography variant="subtitle2" mb={1}>
            Notas o Motivo de la solicitud
          </Typography>

          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Explica brevemente por qué necesitas este producto..."
            sx={{ marginBottom: 4 }}
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
              Enviar Solicitud
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sent;
