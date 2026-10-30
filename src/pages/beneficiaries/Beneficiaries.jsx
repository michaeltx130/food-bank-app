import { useState, useEffect, useCallback } from "react";
import { Box, Button, Typography, Pagination, Skeleton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import MainLayout from "../../components/layout/MainLayout";
import EmptyState from "../../components/common/EmptyState";
import BeneficiaryStatCard from "../../components/beneficiaries/BeneficiaryStatCard";
import BeneficiaryCard from "../../components/beneficiaries/BeneficiaryCard";
import BeneficiaryForm from "../../components/beneficiaries/BeneficiaryForm";
import DeliveryForm from "../../components/beneficiaries/DeliveryForm";

import { getBeneficiarios, getProducts, getEntregas } from "../../services/api";

const ITEMS_PER_PAGE = 3;

const obtenerFechaRegistro = (beneficiario) => {
  return (
    beneficiario.created_at ??
    beneficiario.fecha_registro ??
    beneficiario.fechaRegistro ??
    beneficiario.fecha_creacion ??
    beneficiario.createdAt ??
    beneficiario.familia?.created_at ??
    beneficiario.familia?.fecha_registro ??
    beneficiario.familia?.createdAt ??
    null
  );
};

const formatearFecha = (valor) => {
  if (!valor) return "No disponible";

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return "No disponible";
  }

  return fecha.toLocaleDateString("es-MX");
};

const obtenerIdProducto = (entrega) => {
  return (
    entrega.producto_id ?? entrega.productoId ?? entrega.producto?.id ?? null
  );
};

const obtenerIdBeneficiario = (entrega) => {
  return (
    entrega.beneficiario_id ??
    entrega.beneficiarioId ??
    entrega.beneficiario?.id ??
    null
  );
};

const obtenerNombreProducto = (entrega, productosPorId) => {
  const idProducto = obtenerIdProducto(entrega);

  const productoInventario =
    idProducto != null ? productosPorId.get(String(idProducto)) : null;

  return (
    entrega.producto?.nombre ??
    entrega.producto?.name ??
    entrega.producto_nombre ??
    entrega.nombre_producto ??
    productoInventario?.nombre ??
    productoInventario?.name ??
    (idProducto != null
      ? `Producto #${idProducto}`
      : "Producto no identificado")
  );
};

const obtenerUnidadProducto = (entrega, productosPorId) => {
  const idProducto = obtenerIdProducto(entrega);

  const productoInventario =
    idProducto != null ? productosPorId.get(String(idProducto)) : null;

  return (
    entrega.producto?.unit ??
    entrega.producto?.unidad ??
    entrega.unit ??
    entrega.unidad ??
    productoInventario?.unit ??
    productoInventario?.unidad ??
    "pz"
  );
};

const mapearBeneficiarios = (beneficiarios, productos, entregasGenerales) => {
  const productosPorId = new Map(
    productos.map((producto) => [String(producto.id), producto]),
  );

  return beneficiarios.map((beneficiario) => {
    const entregasIncluidas = Array.isArray(beneficiario.entregas)
      ? beneficiario.entregas
      : [];

    const entregasConsultadas = entregasGenerales.filter(
      (entrega) =>
        String(obtenerIdBeneficiario(entrega)) === String(beneficiario.id),
    );

    // Se usa la lista más completa, sin sumar ambas,
    // para evitar duplicar entregas.
    const entregas =
      entregasConsultadas.length > entregasIncluidas.length
        ? entregasConsultadas
        : entregasIncluidas;

    const history = entregas
      .map((entrega) => {
        const nombre = obtenerNombreProducto(entrega, productosPorId);

        const unidad = obtenerUnidadProducto(entrega, productosPorId);

        const cantidad = entrega.cantidad ?? 0;

        return {
          id: entrega.id,
          fechaOriginal:
            entrega.fecha ?? entrega.created_at ?? entrega.createdAt ?? null,
          date: formatearFecha(
            entrega.fecha ?? entrega.created_at ?? entrega.createdAt,
          ),
          items: [`${cantidad} ${unidad} ${nombre}`],
        };
      })
      .sort((a, b) => {
        const fechaA = a.fechaOriginal
          ? new Date(a.fechaOriginal).getTime()
          : 0;

        const fechaB = b.fechaOriginal
          ? new Date(b.fechaOriginal).getTime()
          : 0;

        return (
          (Number.isFinite(fechaB) ? fechaB : 0) -
          (Number.isFinite(fechaA) ? fechaA : 0)
        );
      });

    return {
      ...beneficiario,
      name: beneficiario.nombre,
      members: Number(
        beneficiario.familia?.cantidad_miembros ??
          beneficiario.cantidad_miembros ??
          0,
      ),
      deliveries: entregas.length,
      entregas,
      created_at: obtenerFechaRegistro(beneficiario),
      history,
    };
  });
};

const consultarDatos = async () => {
  const [respuestaBeneficiarios, respuestaProductos, respuestaEntregas] =
    await Promise.all([getBeneficiarios(), getProducts(), getEntregas()]);

  const beneficiarios = Array.isArray(respuestaBeneficiarios)
    ? respuestaBeneficiarios
    : [];

  const productos = Array.isArray(respuestaProductos) ? respuestaProductos : [];

  const entregas = Array.isArray(respuestaEntregas) ? respuestaEntregas : [];

  return mapearBeneficiarios(beneficiarios, productos, entregas);
};

const Beneficiaries = () => {
  const [open, setOpen] = useState(false);
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const fetchBeneficiarios = useCallback(async () => {
    setLoading(true);

    try {
      const datos = await consultarDatos();

      setFamilias(datos);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error cargando beneficiarios:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    consultarDatos()
      .then((datos) => {
        if (!activo) return;

        setFamilias(datos);
        setCurrentPage(1);
      })
      .catch((error) => {
        if (!activo) return;

        console.error("Error cargando beneficiarios:", error);
      })
      .finally(() => {
        if (activo) {
          setLoading(false);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  const totalPersonas = familias.reduce(
    (total, familia) => total + (familia.members ?? 0),
    0,
  );

  const totalEntregas = familias.reduce(
    (total, familia) => total + (familia.deliveries ?? 0),
    0,
  );

  const handleNuevaEntrega = (family) => {
    setFamiliaSeleccionada(family);
    setDeliveryOpen(true);
  };

  const totalPages = Math.ceil(familias.length / ITEMS_PER_PAGE);

  const paginaActual = Math.min(currentPage, Math.max(totalPages, 1));

  const startIndex = (paginaActual - 1) * ITEMS_PER_PAGE;

  const currentFamilias = familias.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
        }}
      >
        {/* ENCABEZADO */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            width: "100%",
            minHeight: "44px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#171717",
            }}
          >
            Beneficiarios
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: "#029739",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 1,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#15803d",
                boxShadow: "none",
              },
            }}
          >
            Registrar Familia
          </Button>
        </Box>

        {/* ESTADÍSTICAS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: "24px",
            width: "100%",
          }}
        >
          <BeneficiaryStatCard
            value={familias.length}
            label="Familias registradas"
          />

          <BeneficiaryStatCard
            value={totalPersonas}
            label="Personas beneficiadas"
          />

          <BeneficiaryStatCard
            value={totalEntregas}
            label="Entregas registradas"
          />
        </Box>

        {/* LISTADO DE FAMILIAS */}
        <Box
          sx={{
            width: "100%",
            mt: 1,
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {[1, 2, 3].map((numero) => (
                <Skeleton
                  key={numero}
                  height={80}
                  sx={{
                    borderRadius: "12px",
                  }}
                />
              ))}
            </Box>
          ) : familias.length === 0 ? (
            <Box
              sx={{
                py: 6,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <EmptyState
                icon={PeopleAltIcon}
                title="Sin beneficiarios registrados"
                description="Comienza registrando la primera familia beneficiaria."
              />
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  width: "100%",
                }}
              >
                {currentFamilias.map((family) => (
                  <BeneficiaryCard
                    key={family.id}
                    family={family}
                    onNuevaEntrega={handleNuevaEntrega}
                  />
                ))}
              </Box>

              {totalPages > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={paginaActual}
                    onChange={(_, value) => setCurrentPage(value)}
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

      {/* FORMULARIOS */}
      <BeneficiaryForm
        open={open}
        setOpen={setOpen}
        onSuccess={fetchBeneficiarios}
      />

      <DeliveryForm
        open={deliveryOpen}
        setOpen={setDeliveryOpen}
        family={familiaSeleccionada}
        onSuccess={fetchBeneficiarios}
      />
    </MainLayout>
  );
};

export default Beneficiaries;
