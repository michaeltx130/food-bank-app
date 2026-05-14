import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const requestData = {
  fromBranch: "Los Cabos",
  product: "Machaca",
  quantity: 40,
  unit: "kg",
  currentStock: 80,
  reason: "Tenemos alta demanda de machaca y bajo stock",
  date: "2026-05-01",
};

function RequestCard({ showActions = true }) {
  const {
    fromBranch,
    product,
    quantity,
    unit,
    currentStock,
    reason,
    date,
  } = requestData;

  return (
    <Card sx={{ width: "100%", maxWidth: 1000, borderRadius: 4, boxShadow: 2 }}>
      <CardContent sx={{ padding: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ApartmentOutlinedIcon sx={{ color: "#6b7280", fontSize: 18 }} />
          <Typography variant="subtitle2" color="text.secondary">
            Solicitud de: {fromBranch}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 3 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              backgroundColor: "#fff3ed",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Inventory2OutlinedIcon sx={{ color: "#f97316", fontSize: 32 }} />
          </Box>

          <Box>
            <Typography variant="h5" fontWeight="bold">
              {quantity} {unit} de {product}
            </Typography>
            <Typography color="text.secondary">
              Tu stock actual: {currentStock} {unit}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: 2,
            borderRadius: "12px",
            marginTop: 3,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {reason}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Fecha: {date}
          </Typography>

          {showActions && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="warning"
                startIcon={<CheckIcon />}
                sx={{ borderRadius: 3, textTransform: "none", paddingX: 3 }}
              >
                Aprobar
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                sx={{ borderRadius: 3, textTransform: "none", paddingX: 3 }}
              >
                Rechazar
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default RequestCard;