import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function RequestCard({
  solicitud = {},
  showActions = true,
  onAprobar,
  onRechazar,
  type,
}) {
  const {
    transferencia_id,
    producto_nombre,
    cantidad,
    destino,
    origen,
    estado,
    aprobacion,
    created_at,
  } = solicitud;

  const esEnviada = type === "sent";
  const sucursal = esEnviada ? destino : origen;

  const estadoActual = aprobacion || estado;

  const estadoColor = {
    aceptado: {
      bg: "#dcfce7",
      text: "#16a34a",
    },

    denegado: {
      bg: "#fee2e2",
      text: "#dc2626",
    },

    en_espera: {
      bg: "#fef9c3",
      text: "#854d0e",
    },

    COMPLETADO: {
      bg: "#dcfce7",
      text: "#16a34a",
    },

    FALLIDO: {
      bg: "#fee2e2",
      text: "#dc2626",
    },

    PENDIENTE: {
      bg: "#fef9c3",
      text: "#854d0e",
    },

    DESCONTADO_ORIGEN: {
      bg: "#dbeafe",
      text: "#1d4ed8",
    },
  }[estadoActual] || {
    bg: "#f3f4f6",
    text: "#6b7280",
  };

  console.log("SOLICITUD", solicitud);
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 4,
        boxShadow: 2,
        boxSizing: "border-box",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ApartmentOutlinedIcon
              sx={{
                color: "#6b7280",
                fontSize: 18,
              }}
            />

            <Typography variant="subtitle2" color="text.secondary">
              {esEnviada
                ? `Solicitud enviada a: ${sucursal}`
                : `Solicitud de: ${sucursal}`}
            </Typography>
          </Box>

          {estado && (
            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontWeight: 600,
                backgroundColor: estadoColor.bg,
                color: estadoColor.text,
              }}
            >
              {String(estadoActual).replace(/_/g, " ").toUpperCase()}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            mt: 3,
            flexWrap: "wrap",
          }}
        >
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
            <Inventory2OutlinedIcon
              sx={{
                color: "#f97316",
                fontSize: 32,
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              wordBreak: "break-word",
            }}
          >
            {cantidad} {solicitud.producto?.unit || solicitud.unit || "pz"} de{" "}
            {producto_nombre || "—"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            mt: 4,
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {created_at
              ? `Fecha: ${new Date(created_at).toLocaleDateString("es-MX")}`
              : ""}
          </Typography>

          {showActions && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                width: {
                  xs: "100%",
                  md: "auto",
                },
              }}
            >
              <Button
                variant="contained"
                color="warning"
                startIcon={<CheckIcon />}
                onClick={() => onAprobar?.(transferencia_id)}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  px: 3,
                  flex: {
                    xs: 1,
                    md: "unset",
                  },
                }}
              >
                Aprobar
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => onRechazar?.(transferencia_id)}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  px: 3,
                  flex: {
                    xs: 1,
                    md: "unset",
                  },
                }}
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
