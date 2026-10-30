import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  Typography,
  Box,
  TextField,
  MenuItem,
  IconButton,
  Button,
  Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import { getProducts, createEntrega } from "../../services/api";

const nuevoRenglon = () => ({
  productoId: "",
  cantidad: "",
});

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "#404040",
    fontWeight: 500,
  },
  "& .MuiOutlinedInput-input.Mui-disabled": {
    WebkitTextFillColor: "#171717",
  },
};

const rowFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
  },
};

const DeliveryForm = ({ open, setOpen, family, onSuccess }) => {
  const [renglones, setRenglones] = useState([nuevoRenglon()]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const listEndRef = useRef(null);
  const prevCount = useRef(1);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    let activo = true;

    Promise.resolve()
      .then(() => {
        if (!activo) return null;

        setLoadingProductos(true);
        setError(null);
        setSuccess(false);
        setErrors({});

        return getProducts();
      })
      .then((data) => {
        if (!activo || !data) return;

        const mapped = (Array.isArray(data) ? data : []).map((p) => ({
          id: p.id,
          name: p.nombre,
          stock: Number(p.cantidad) || 0,
          unit: p.unit || "pz",
        }));

        setProductos(mapped);
      })
      .catch((err) => {
        if (!activo) return;

        console.error("Error obteniendo productos:", err);
        setError("No se pudieron cargar los productos.");
      })
      .finally(() => {
        if (activo) setLoadingProductos(false);
      });

    return () => {
      activo = false;
    };
  }, [open]);

  useEffect(() => {
    if (renglones.length > prevCount.current) {
      listEndRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }

    prevCount.current = renglones.length;
  }, [renglones.length]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const limpiarFormulario = () => {
    setRenglones([nuevoRenglon()]);
    setError(null);
    setSuccess(false);
    setErrors({});
  };

  const handleClose = () => {
    if (loading) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    limpiarFormulario();
    setOpen(false);
  };

  const handleAddRenglon = () => {
    if (loading) return;

    setRenglones((prev) => [...prev, nuevoRenglon()]);
  };

  const handleRemoveRenglon = (index) => {
    if (loading || renglones.length === 1) return;

    setRenglones((prev) => prev.filter((_, i) => i !== index));
    setErrors({});
  };

  const handleChangeRenglon = (index, field, value) => {
    if (loading) return;

    setRenglones((prev) =>
      prev.map((renglon, i) =>
        i === index ? { ...renglon, [field]: value } : renglon,
      ),
    );

    setErrors((prev) => ({
      ...prev,
      [`${field === "productoId" ? "prod" : "cant"}_${index}`]: "",
    }));
  };

  const productosUsados = renglones
    .map((r) => String(r.productoId))
    .filter((id) => id !== "");

  const getProducto = (id) =>
    productos.find((p) => String(p.id) === String(id));

  const handleSubmit = async () => {
    if (loading || success) return;

    if (!family?.id) {
      setError("No hay familia seleccionada.");
      return;
    }

    if (productos.length === 0) {
      setError("No hay productos disponibles.");
      return;
    }

    const newErrors = {};
    const seleccionados = new Set();

    renglones.forEach((r, idx) => {
      const id = String(r.productoId);
      const cantidad = Number(r.cantidad);

      if (!r.productoId) {
        newErrors[`prod_${idx}`] = "Selecciona un producto.";
      } else if (seleccionados.has(id)) {
        newErrors[`prod_${idx}`] = "Este producto ya está seleccionado.";
      } else {
        seleccionados.add(id);

        if (!getProducto(r.productoId)) {
          newErrors[`prod_${idx}`] = "Producto no disponible.";
        }
      }

      if (r.cantidad === "") {
        newErrors[`cant_${idx}`] = "Ingresa una cantidad.";
      } else if (!Number.isInteger(cantidad) || cantidad <= 0) {
        newErrors[`cant_${idx}`] = "Ingresa un número entero mayor a 0.";
      } else {
        const producto = getProducto(r.productoId);

        if (producto && cantidad > producto.stock) {
          newErrors[`cant_${idx}`] = `Excede el stock (${producto.stock}).`;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setError(null);
    setLoading(true);

    try {
      const resultados = await Promise.all(
        renglones.map((r) =>
          createEntrega({
            beneficiario_id: family.id,
            producto_id: Number(r.productoId),
            cantidad: Number(r.cantidad),
          }),
        ),
      );

      if (resultados.some((resultado) => !resultado)) {
        setError(
          "Una o más entregas no pudieron registrarse. Revisa el historial antes de reintentar.",
        );
        onSuccess?.();
        return;
      }

      setSuccess(true);
      onSuccess?.();

      timeoutRef.current = setTimeout(() => {
        limpiarFormulario();
        setOpen(false);
        timeoutRef.current = null;
      }, 800);
    } catch (err) {
      console.error("Error registrando entrega:", err);

      setError(
        "Error al registrar la entrega. Revisa el historial antes de reintentar.",
      );

      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "12px",
            width: "100%",
            maxWidth: "680px",
            margin: "16px",
            maxHeight: "calc(100% - 32px)",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      {/* ENCABEZADO FIJO */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "32px 40px 16px 24px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "24px",
            color: "#171717",
            lineHeight: 1.2,
          }}
        >
          Nueva entrega
        </Typography>
      </Box>

      {/* CONTENIDO CON SCROLL */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "8px 24px 24px",
          gap: 2,
          width: "100%",
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {(error || success) && (
          <Box sx={{ width: "100%" }}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  width: "100%",
                  borderRadius: "12px",
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{
                  width: "100%",
                  borderRadius: "12px",
                }}
              >
                ¡Entrega registrada!
              </Alert>
            )}
          </Box>
        )}

        {/* BENEFICIARIO */}
        <TextField
          fullWidth
          label="Familia / Beneficiario"
          value={family?.nombre || family?.name || "Sin beneficiario"}
          disabled
          slotProps={{
            inputLabel: { shrink: true },
          }}
          sx={textFieldStyle}
        />

        {/* FECHA INFORMATIVA */}
        <TextField
          fullWidth
          label="Fecha de entrega"
          value={new Date().toLocaleDateString("en-CA")}
          disabled
          slotProps={{
            inputLabel: { shrink: true },
          }}
          sx={textFieldStyle}
        />

        {/* PRODUCTOS */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 0.5,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "16px",
              color: "#171717",
            }}
          >
            Productos
          </Typography>

          {loadingProductos && (
            <Typography fontSize="13px" color="text.secondary">
              Cargando productos...
            </Typography>
          )}

          {renglones.map((renglon, index) => {
            const prodError = errors[`prod_${index}`];

            const cantError = errors[`cant_${index}`];

            return (
              <Box
                key={index}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr 1fr 40px",
                    sm: "28px 2fr 1fr 40px",
                  },
                  gap: "12px",
                  alignItems: "flex-start",
                  width: "100%",
                  boxSizing: "border-box",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E7E5E4",
                  borderRadius: "12px",
                  padding: "10px",
                  animation: "rowIn 0.18s ease-out",
                  "@keyframes rowIn": {
                    from: {
                      opacity: 0,
                      transform: "translateY(-6px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "none",
                    },
                  },
                }}
              >
                {/* NÚMERO */}
                <Typography
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#737373",
                    mt: "9px",
                  }}
                >
                  {index + 1}
                </Typography>

                {/* PRODUCTO */}
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Producto"
                  value={renglon.productoId}
                  disabled={loading || loadingProductos || success}
                  onChange={(e) =>
                    handleChangeRenglon(index, "productoId", e.target.value)
                  }
                  error={!!prodError}
                  helperText={prodError}
                  sx={{
                    ...rowFieldStyle,
                    gridColumn: {
                      xs: "1 / 3",
                      sm: "auto",
                    },
                  }}
                >
                  {productos.map((p) => {
                    const seleccionadoEnOtro =
                      productosUsados.includes(String(p.id)) &&
                      String(renglon.productoId) !== String(p.id);

                    return (
                      <MenuItem
                        key={p.id}
                        value={p.id}
                        disabled={seleccionadoEnOtro || p.stock <= 0}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <span>{p.name}</span>

                          <Typography
                            component="span"
                            fontSize="12px"
                            color="text.secondary"
                          >
                            Disp: {p.stock} {p.unit}
                          </Typography>
                        </Box>
                      </MenuItem>
                    );
                  })}
                </TextField>

                {/* CANTIDAD */}
                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  label="Cantidad"
                  value={renglon.cantidad}
                  disabled={loading || success}
                  onChange={(e) =>
                    handleChangeRenglon(index, "cantidad", e.target.value)
                  }
                  error={!!cantError}
                  helperText={cantError}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      step: 1,
                    },
                  }}
                  sx={{
                    ...rowFieldStyle,
                    gridColumn: {
                      xs: "1 / -1",
                      sm: "auto",
                    },
                    gridRow: {
                      xs: 2,
                      sm: "auto",
                    },
                  }}
                />

                {/* ELIMINAR FILA */}
                <IconButton
                  aria-label="Quitar producto"
                  onClick={() => handleRemoveRenglon(index)}
                  disabled={loading || success || renglones.length === 1}
                  sx={{
                    color: "#A3A3A3",
                    borderRadius: "10px",
                    gridColumn: {
                      xs: 3,
                      sm: "auto",
                    },
                    gridRow: {
                      xs: 1,
                      sm: "auto",
                    },
                    "&:hover": {
                      backgroundColor: "#E8F6ED",
                      color: "#C62828",
                    },
                  }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            );
          })}

          {/* AGREGAR PRODUCTO */}
          <Button
            fullWidth
            startIcon={<AddIcon />}
            onClick={handleAddRenglon}
            disabled={loading || loadingProductos || success}
            sx={{
              textTransform: "none",
              color: "#029739",
              fontWeight: 600,
              border: "1.5px dashed #029739",
              borderRadius: "12px",
              paddingY: "12px",
              mt: "2px",
              "&:hover": {
                backgroundColor: "#E8F6ED",
                border: "1.5px dashed #029739",
              },
            }}
          >
            Agregar otro producto
          </Button>

          <div ref={listEndRef} />
        </Box>
      </Box>

      {/* BOTONES FIJOS AL PIE */}
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          width: "100%",
          padding: "16px 24px 24px",
          boxSizing: "border-box",
          flexShrink: 0,
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
          sx={{
            borderRadius: "12px",
            paddingY: 1.2,
            textTransform: "none",
            fontWeight: 400,
            borderColor: "#E7E5E4",
            color: "#44403C",
          }}
        >
          Cancelar
        </Button>

        <LoadingButton
          fullWidth
          variant="contained"
          loading={loading}
          disabled={
            loading || loadingProductos || success || productos.length === 0
          }
          onClick={handleSubmit}
          sx={{
            borderRadius: "12px",
            paddingY: 1.2,
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: "#029739",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#15803d",
              boxShadow: "none",
            },
          }}
        >
          {renglones.length > 1
            ? `Registrar Entrega (${renglones.length})`
            : "Registrar Entrega"}
        </LoadingButton>
      </Box>
    </Dialog>
  );
};

export default DeliveryForm;
