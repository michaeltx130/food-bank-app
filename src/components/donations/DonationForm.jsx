import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import { getCategories, createDonacion } from "../../services/api";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    "&.Mui-focused fieldset": {
      borderColor: "#029739",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#029739",
  },
};

const rowFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    "&.Mui-focused fieldset": {
      borderColor: "#029739",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#029739",
  },
};

const errorKeys = {
  producto_nombre: "producto_nombre",
  categoria_id: "categoria_id",
  cantidad: "cantidad",
  unit: "unit",
};

const createNewProducto = () => ({
  id: Date.now() + Math.random(),
  producto_nombre: "",
  categoria_id: "",
  cantidad: "",
  unit: "",
});

const DonationForm = ({ open, setOpen, onSuccess }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({ donante_nombre: "" });
  const [productos, setProductos] = useState([createNewProducto()]);
  const [focusId, setFocusId] = useState(null);

  const listEndRef = useRef(null);
  const prevCount = useRef(1);

  useEffect(() => {
    if (!open) return;

    let activo = true;

    getCategories()
      .then((data) => {
        if (activo) setCategorias(data);
      })
      .catch(() => {
        if (activo) setError("Error al cargar categorías.");
      });

    return () => {
      activo = false;
    };
  }, [open]);

  useEffect(() => {
    if (productos.length > prevCount.current) {
      listEndRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
    prevCount.current = productos.length;
  }, [productos.length]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddProducto = () => {
    const nuevo = createNewProducto();
    setProductos((prev) => [...prev, nuevo]);
    setFocusId(nuevo.id);
  };

  const handleRemoveProducto = (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[`producto_nombre_${id}`];
      delete copy[`categoria_id_${id}`];
      delete copy[`cantidad_${id}`];
      delete copy[`unit_${id}`];
      return copy;
    });
  };

  const handleChangeProducto = (id, field, value) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
    setErrors((prev) => ({ ...prev, [`${errorKeys[field]}_${id}`]: "" }));
  };

  const handleCantidadKeyDown = (e, prod) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (prod.producto_nombre.trim() && prod.categoria_id && prod.cantidad) {
      handleAddProducto();
    }
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setError(null);
    setSuccess(false);
    setErrors({});
    setFocusId(null);
    setForm({ donante_nombre: "" });
    setProductos([createNewProducto()]);
  };

  const handleSubmit = async () => {
    if (loading) return;

    const newErrors = {};

    if (!form.donante_nombre.trim()) {
      newErrors.donante_nombre = "Ingresa el nombre del donante";
    }

    productos.forEach((p) => {
      if (!p.producto_nombre.trim()) {
        newErrors[`producto_nombre_${p.id}`] = "Ingresa el producto";
      }

      if (!p.categoria_id) {
        newErrors[`categoria_id_${p.id}`] = "Selecciona";
      }

      if (!p.cantidad) {
        newErrors[`cantidad_${p.id}`] = "Requerida";
      } else if (Number(p.cantidad) <= 0) {
        newErrors[`cantidad_${p.id}`] = "Mayor a 0";
      } else if (!Number.isInteger(Number(p.cantidad))) {
        newErrors[`cantidad_${p.id}`] = "Solo enteros";
      }

      if (!p.unit) {
        newErrors[`unit_${p.id}`] = "Selecciona";
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
      const results = await Promise.allSettled(
        productos.map((p) =>
          createDonacion({
            donante: form.donante_nombre.trim(),
            producto: p.producto_nombre.trim(),
            cantidad: Number(p.cantidad),
            unit: p.unit,
            categoria_id: Number(p.categoria_id),
          }),
        ),
      );

      const fallidos = productos.filter(
        (_, i) => results[i].status === "rejected",
      );

      if (fallidos.length < productos.length) {
        onSuccess?.();
      }

      if (fallidos.length === 0) {
        setSuccess(true);
        setTimeout(handleClose, 800);
      } else {
        setProductos(fallidos);
        setError(
          `No se pudieron registrar ${fallidos.length} de ${productos.length} productos.`,
        );
      }
    } catch {
      setError("Error al registrar la donación.");
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
      PaperProps={{
        sx: {
          borderRadius: "12px",
          width: "100%",
          maxWidth: "760px",
          margin: "16px",
          maxHeight: "calc(100% - 32px)",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "32px 40px 24px 24px",
          gap: "8px",
          boxSizing: "border-box",
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
          Registrar donación
        </Typography>
      </Box>

      {(error || success) && (
        <Box
          sx={{
            padding: "0px 24px 16px 24px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {error && (
            <Alert
              severity="error"
              sx={{ width: "100%", borderRadius: "12px" }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              sx={{ width: "100%", borderRadius: "12px" }}
            >
              ¡Donación registrada!
            </Alert>
          )}
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "8px 24px 16px 24px",
          gap: 2,
          width: "100%",
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        <TextField
          fullWidth
          label="Donante"
          name="donante_nombre"
          value={form.donante_nombre}
          onChange={(e) => {
            handleChange(e);
            setErrors((prev) => ({ ...prev, donante_nombre: "" }));
          }}
          error={!!errors.donante_nombre}
          helperText={errors.donante_nombre}
          sx={textFieldStyle}
        />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            sx={{ fontWeight: 700, fontSize: "16px", color: "#171717" }}
          >
            Productos a donar
          </Typography>

          {productos.map((prod, index) => (
            <Box
              key={prod.id}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr 40px",
                  sm: "28px 1.6fr 1.2fr 0.8fr 1fr 40px",
                },
                gap: "8px",
                alignItems: "flex-start",
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "#F9FAFB",
                border: "1px solid #E7E5E4",
                borderRadius: "12px",
                padding: "10px",
              }}
            >
              <Typography
                sx={{
                  display: { xs: "none", sm: "block" },
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#737373",
                  mt: "9px",
                }}
              >
                {index + 1}
              </Typography>

              <TextField
                fullWidth
                size="small"
                autoFocus={prod.id === focusId}
                label="Producto"
                placeholder="Alimento/producto"
                value={prod.producto_nombre}
                onChange={(e) =>
                  handleChangeProducto(
                    prod.id,
                    "producto_nombre",
                    e.target.value,
                  )
                }
                error={!!errors[`producto_nombre_${prod.id}`]}
                helperText={errors[`producto_nombre_${prod.id}`]}
                sx={{
                  ...rowFieldStyle,
                  gridColumn: { xs: "1 / 3", sm: "auto" },
                }}
              />

              <TextField
                fullWidth
                select
                size="small"
                label="Categoría"
                value={prod.categoria_id}
                onChange={(e) =>
                  handleChangeProducto(prod.id, "categoria_id", e.target.value)
                }
                error={!!errors[`categoria_id_${prod.id}`]}
                helperText={errors[`categoria_id_${prod.id}`]}
                sx={{
                  ...rowFieldStyle,
                  gridColumn: { xs: "1 / -1", sm: "auto" },
                }}
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                size="small"
                label="Cantidad"
                type="number"
                value={prod.cantidad}
                onChange={(e) =>
                  handleChangeProducto(prod.id, "cantidad", e.target.value)
                }
                onKeyDown={(e) => handleCantidadKeyDown(e, prod)}
                error={!!errors[`cantidad_${prod.id}`]}
                helperText={errors[`cantidad_${prod.id}`]}
                inputProps={{ min: 1 }}
                sx={rowFieldStyle}
              />

              <TextField
                fullWidth
                select
                size="small"
                label="Unidad"
                value={prod.unit}
                onChange={(e) =>
                  handleChangeProducto(prod.id, "unit", e.target.value)
                }
                error={!!errors[`unit_${prod.id}`]}
                helperText={errors[`unit_${prod.id}`]}
                sx={rowFieldStyle}
              >
                <MenuItem value="pz">Pz</MenuItem>
                <MenuItem value="kg">Kg</MenuItem>
                <MenuItem value="gr">Gramos</MenuItem>
                <MenuItem value="L">Litros</MenuItem>
                <MenuItem value="ml">Mililitros</MenuItem>
              </TextField>

              <IconButton
                aria-label="Quitar producto"
                onClick={() => handleRemoveProducto(prod.id)}
                disabled={productos.length === 1}
                sx={{
                  color: "#A3A3A3",
                  borderRadius: "10px",
                  gridColumn: { xs: 3, sm: "auto" },
                  gridRow: { xs: 1, sm: "auto" },
                  "&:hover": {
                    backgroundColor: "#E8F6ED",
                    color: "#C62828",
                  },
                }}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            fullWidth
            startIcon={<AddIcon />}
            onClick={handleAddProducto}
            sx={{
              textTransform: "none",
              color: "#029739",
              fontWeight: 600,
              border: "1.5px dashed #029739",
              borderRadius: "12px",
              paddingY: "13px",
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

      <Box
        sx={{
          display: "flex",
          gap: 2,
          width: "100%",
          padding: "16px 24px 24px 24px",
          boxSizing: "border-box",
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
          disabled={loading}
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
          {productos.length > 1
            ? `Registrar donación (${productos.length})`
            : "Registrar donación"}
        </LoadingButton>
      </Box>
    </Dialog>
  );
};

export default DonationForm;
