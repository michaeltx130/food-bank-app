import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Collapse,
  IconButton,
  Pagination,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ITEMS_PER_PAGE = 3;

const formatearFechaRegistro = (valor) => {
  if (!valor) {
    return "No disponible";
  }

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return "No disponible";
  }

  return fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const BeneficiaryCard = ({ family, onNuevaEntrega }) => {
  const [expanded, setExpanded] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);

  const historyItems = Array.isArray(family.history) ? family.history : [];

  const totalHistoryPages = Math.ceil(historyItems.length / ITEMS_PER_PAGE);

  const paginaActual = Math.min(historyPage, Math.max(totalHistoryPages, 1));

  const startIndex = (paginaActual - 1) * ITEMS_PER_PAGE;

  const currentHistory = historyItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const fechaRegistro =
    family.created_at ??
    family.fecha_registro ??
    family.fechaRegistro ??
    family.fecha_creacion ??
    family.createdAt ??
    family.familia?.created_at ??
    family.familia?.fecha_registro ??
    null;

  const cantidadMiembros =
    family.familia?.cantidad_miembros ?? family.members ?? 0;

  const cantidadEntregas = family.deliveries ?? family.entregas?.length ?? 0;

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* ENCABEZADO DE LA TARJETA */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "18px",
            color: "#1F2937",
          }}
        >
          {family.nombre || family.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 1.5,
              sm: 3,
            },
            flexWrap: "wrap",
          }}
        >
          {/* MIEMBROS */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PeopleAltIcon
              sx={{
                fontSize: 18,
                color: "#F97316",
              }}
            />

            <Typography
              sx={{
                fontSize: "14px",
                color: "#1F2937",
              }}
            >
              {cantidadMiembros} miembros
            </Typography>
          </Box>

          {/* ENTREGAS */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Inventory2Icon
              sx={{
                fontSize: 18,
                color: "#F97316",
              }}
            />

            <Typography
              sx={{
                fontSize: "14px",
                color: "#1F2937",
              }}
            >
              {cantidadEntregas} entregas
            </Typography>
          </Box>

          {/* NUEVA ENTREGA */}
          <Button
            variant="contained"
            onClick={() => onNuevaEntrega(family)}
            sx={{
              backgroundColor: "#029739",
              color: "#FFFFFF",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "12px",
              px: "16px",
              py: "8px",
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
              "&:hover": {
                backgroundColor: "#15803d",
                boxShadow: "none",
              },
            }}
          >
            Nueva Entrega
          </Button>

          {/* EXPANDIR / CONTRAER */}
          <IconButton
            aria-label={expanded ? "Ocultar detalles" : "Mostrar detalles"}
            onClick={() => setExpanded(!expanded)}
            sx={{
              color: "#4B5563",
            }}
          >
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* CONTENIDO DESPLEGABLE */}
      <Collapse in={expanded}>
        <Box
          sx={{
            padding: "24px",
            borderTop: "1px solid #F3F4F6",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* INFORMACIÓN DE LA FAMILIA */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {/* DIRECCIÓN */}
            <Box>
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#9CA3AF",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  mb: 0.5,
                }}
              >
                DIRECCIÓN
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#1F2937",
                }}
              >
                {family.familia?.direccion ??
                  family.direccion ??
                  "Sin dirección"}
              </Typography>
            </Box>

            {/* TELÉFONO */}
            <Box>
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#9CA3AF",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  mb: 0.5,
                }}
              >
                TELÉFONO
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#1F2937",
                }}
              >
                {family.familia?.telefono ?? family.telefono ?? "Sin teléfono"}
              </Typography>
            </Box>

            {/* FECHA DE REGISTRO */}
            <Box>
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#9CA3AF",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  mb: 0.5,
                }}
              >
                FECHA DE REGISTRO
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#1F2937",
                }}
              >
                {formatearFechaRegistro(fechaRegistro)}
              </Typography>
            </Box>
          </Box>

          {/* HISTORIAL DE ENTREGAS */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#1F2937",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
              }}
            >
              HISTORIAL DE ENTREGAS
            </Typography>

            {historyItems.length === 0 ? (
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#6B7280",
                }}
              >
                Sin entregas registradas.
              </Typography>
            ) : (
              <>
                {currentHistory.map((entrega, index) => (
                  <Box
                    key={entrega.id ?? index}
                    sx={{
                      display: "flex",
                      alignItems: {
                        xs: "flex-start",
                        sm: "center",
                      },
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
                      padding: "16px 20px",
                      gap: {
                        xs: 1.5,
                        sm: 4,
                      },
                      backgroundColor: "#F9FAFB",
                      borderRadius: "12px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* FECHA DE ENTREGA */}
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#1F2937",
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      {entrega.date ?? "No disponible"}
                    </Typography>

                    {/* PRODUCTOS ENTREGADOS */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {(entrega.items ?? []).map((item, itemIndex) => (
                        <Box
                          key={itemIndex}
                          sx={{
                            backgroundColor: "#F97316",
                            color: "#FFFFFF",
                            borderRadius: "50px",
                            padding: "4px 12px",
                            fontSize: "12px",
                            fontWeight: 500,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {item}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}

                {/* PAGINACIÓN DEL HISTORIAL */}
                {totalHistoryPages > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                    }}
                  >
                    <Pagination
                      count={totalHistoryPages}
                      page={paginaActual}
                      onChange={(_, value) => setHistoryPage(value)}
                      size="small"
                      sx={{
                        "& .MuiPaginationItem-root.Mui-selected": {
                          backgroundColor: "#029739",
                          color: "#FFFFFF",
                          "&:hover": {
                            backgroundColor: "#15803d",
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default BeneficiaryCard;
