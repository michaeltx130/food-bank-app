import { useEffect, useState, useMemo, useCallback } from "react";

import MainLayout from "../components/layout/MainLayout";
import { Box, Typography, Skeleton } from "@mui/material";

import StatCard from "../components/dashboard/StatCard";
import InfoPanel from "../components/dashboard/InfoPanel";
import EmptyState from "../components/common/EmptyState";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

import { PieChart, LineChart } from "@mui/x-charts";

import {
  getProducts,
  getBeneficiarios,
  getSolicitudesRecibidas,
  getSolicitudesEnviadas,
  getDonaciones,
  getEntregas,
} from "../services/api";

const CURRENT_NODE = import.meta.env.VITE_CURRENT_NODE;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [donaciones, setDonaciones] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [
        productsData,
        familiasData,
        solicitudesRecibidasData,
        solicitudesEnviadasData,
        donacionesData,
        entregasData,
      ] = await Promise.all([
        getProducts(),
        getBeneficiarios(),
        getSolicitudesRecibidas(),
        getSolicitudesEnviadas(),
        getDonaciones(),
        getEntregas(),
      ]);

      setProducts(productsData || []);
      setFamilias(familiasData || []);

      const todasLasSolicitudes = [
        ...(solicitudesRecibidasData || []),
        ...(solicitudesEnviadasData || []),
      ];

      const solicitudesUnicas = [
        ...new Map(
          todasLasSolicitudes.map((s) => [s.transferencia_id || s.id, s]),
        ).values(),
      ];

      setSolicitudes(solicitudesUnicas);
      setDonaciones(donacionesData || []);
      setEntregas(entregasData || []);
    } catch (error) {
      console.error("Error obteniendo datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadDashboardData = () => {
      void fetchDashboardData();
    };

    const initialLoad = setTimeout(loadDashboardData, 0);

    const interval = setInterval(loadDashboardData, 10000);

    return () => {
      clearTimeout(initialLoad);
      clearInterval(interval);
    };
  }, [fetchDashboardData]);

  // PRODUCTOS CON BAJO STOCK
  const stockBajo = useMemo(() => {
    return products.filter((p) => p.cantidad > 0 && p.cantidad <= 10);
  }, [products]);

  // SOLICITUDES PENDIENTES
  const solicitudesPendientes = useMemo(() => {
    return solicitudes.filter((s) => {
      const estaEnEspera =
        String(s.aprobacion || s.estado || "")
          .toLowerCase()
          .trim() === "en_espera";

      const esRecibidaEnMiNodo =
        s.origen?.toLowerCase() === CURRENT_NODE?.toLowerCase();

      return estaEnEspera && esRecibidaEnMiNodo;
    });
  }, [solicitudes]);

  const solicitudesAgrupadas = useMemo(() => {
    const VENTANA_MS = 10000;
    const grupos = [];

    [...solicitudesPendientes]
      .sort(
        (a, b) =>
          new Date(b.created_at || b.fecha) - new Date(a.created_at || a.fecha),
      )
      .forEach((s) => {
        const fecha = s.created_at || s.fecha;
        const tiempo = new Date(fecha).getTime();
        const sucursalSolicitante = s.origen;

        let grupo = grupos.find(
          (g) =>
            g.origen === sucursalSolicitante &&
            Math.abs(g.tiempo - tiempo) <= VENTANA_MS,
        );

        if (!grupo) {
          grupo = {
            id: `${sucursalSolicitante}_${fecha}`,
            destino: s.destino,
            origen: s.origen,
            created_at: fecha,
            tiempo,
            aprobacion: s.aprobacion || s.estado,
            error: s.error,
            items: [],
            rawIds: [],
          };

          grupos.push(grupo);
        }

        grupo.rawIds.push(s.transferencia_id || s.id);

        grupo.items.push({
          nombre: s.producto_nombre || s.producto?.nombre || "Producto",
          cantidad: s.cantidad,
          unit: s.producto?.unit || s.unit || "pz",
        });
      });

    return grupos;
  }, [solicitudesPendientes]);

  // 3 PRODUCTOS MÁS SOLICITADOS
  const chartPieData = useMemo(() => {
    const conteoProductos = {};

    entregas.forEach((e) => {
      const nombreProd = e.producto?.nombre || e.producto_nombre || "Producto";

      const cant = Number(e.cantidad) || 1;

      conteoProductos[nombreProd] = (conteoProductos[nombreProd] || 0) + cant;
    });

    solicitudes.forEach((s) => {
      const estadoAprobado =
        String(s.aprobacion || s.estado)
          .toLowerCase()
          .trim() === "aceptado" ||
        String(s.aprobacion || s.estado)
          .toLowerCase()
          .trim() === "completado";

      const esSalidaHaciaOtroNodo =
        s.origen?.toLowerCase() === CURRENT_NODE?.toLowerCase();

      if (estadoAprobado && esSalidaHaciaOtroNodo) {
        const nombreProd =
          s.producto_nombre || s.producto?.nombre || "Producto";

        const cant = Number(s.cantidad) || 1;

        conteoProductos[nombreProd] = (conteoProductos[nombreProd] || 0) + cant;
      }
    });

    const paleta = ["#029739", "#FA7B0A", "#D0F38B"];

    return Object.entries(conteoProductos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label, value], id) => ({
        id,
        value,
        label,
        color: paleta[id % paleta.length],
      }));
  }, [entregas, solicitudes]);

  // ENTRADAS Y SALIDAS DE LA SEMANA ACTUAL
  const chartLineData = useMemo(() => {
    const entradas = [0, 0, 0, 0, 0, 0, 0];
    const salidas = [0, 0, 0, 0, 0, 0, 0];

    const ahora = new Date();
    const diaSemanaActual = ahora.getDay();

    const distanciaAlLunes = diaSemanaActual === 0 ? 6 : diaSemanaActual - 1;

    const inicioSemana = new Date(ahora);

    inicioSemana.setDate(ahora.getDate() - distanciaAlLunes);

    inicioSemana.setHours(0, 0, 0, 0);

    const obtenerIndiceSemanaActual = (fechaStr) => {
      if (!fechaStr) return -1;

      const f = new Date(fechaStr);

      if (isNaN(f.getTime()) || f < inicioSemana) {
        return -1;
      }

      const d = f.getDay();

      return d === 0 ? 6 : d - 1;
    };

    donaciones.forEach((d) => {
      const idx = obtenerIndiceSemanaActual(d.fecha || d.created_at);

      if (idx !== -1) {
        entradas[idx] += Number(d.cantidad) || 1;
      }
    });

    products.forEach((p) => {
      if (p.donaciones?.length > 0) return;

      (p.movimientos || []).forEach((m) => {
        if (m.tipo !== "entrada") return;

        const idx = obtenerIndiceSemanaActual(m.fecha);

        if (idx !== -1) {
          entradas[idx] += Number(m.cantidad) || 1;
        }
      });
    });

    entregas.forEach((e) => {
      const idx = obtenerIndiceSemanaActual(e.fecha || e.created_at);

      if (idx !== -1) {
        salidas[idx] += Number(e.cantidad) || 1;
      }
    });

    solicitudes.forEach((t) => {
      const estadoAprobado =
        String(t.aprobacion || t.estado)
          .toLowerCase()
          .trim() === "aceptado" ||
        String(t.aprobacion || t.estado)
          .toLowerCase()
          .trim() === "completado";

      if (estadoAprobado) {
        const idx = obtenerIndiceSemanaActual(t.updated_at || t.created_at);

        if (idx !== -1) {
          const esEntrada =
            t.destino?.toLowerCase() === CURRENT_NODE?.toLowerCase();

          if (esEntrada) {
            entradas[idx] += Number(t.cantidad) || 1;
          } else {
            salidas[idx] += Number(t.cantidad) || 1;
          }
        }
      }
    });

    return {
      days: [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ],
      entradas,
      salidas,
    };
  }, [donaciones, entregas, solicitudes, products]);

  return (
    <MainLayout>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: "#171717",
        }}
      >
        Dashboard
      </Typography>

      {/* GRID PRINCIPAL */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1.2fr) minmax(0, 0.8fr)",
          },
          gap: "16px",
          width: "100%",
          minHeight: 0,
          alignItems: "stretch",
        }}
      >
        {/* COLUMNA IZQUIERDA */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            minWidth: 0,
          }}
        >
          {/* STAT CARDS */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: "16px",
              width: "100%",
            }}
          >
            <StatCard
              title="Productos en Stock"
              loading={loading}
              value={products.filter((p) => p.cantidad > 0).length}
              description="productos totales"
            />

            <StatCard
              title="Familias registradas"
              loading={loading}
              value={familias.length}
              description="beneficiarios registrados"
            />
          </Box>

          {/* GRÁFICA DONUT */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#171717",
              }}
            >
              Productos más solicitados
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 260,
              }}
            >
              {loading ? (
                <Skeleton variant="circular" width={180} height={180} />
              ) : chartPieData.length > 0 ? (
                <PieChart
                  series={[
                    {
                      data: chartPieData,
                      innerRadius: 65,
                      outerRadius: 100,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  height={240}
                  slotProps={{
                    legend: {
                      direction: "column",
                      position: {
                        vertical: "top",
                        horizontal: "right",
                      },
                    },
                  }}
                />
              ) : (
                <EmptyState
                  icon={DonutLargeIcon}
                  title="Sin datos disponibles"
                  description="Sin registros de solicitudes o entregas."
                />
              )}
            </Box>
          </Box>

          {/* GRÁFICA DE LÍNEAS */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#171717",
              }}
            >
              Entradas y salidas de productos
            </Typography>

            <Box
              sx={{
                height: 300,
                width: "100%",
              }}
            >
              <LineChart
                xAxis={[
                  {
                    data: chartLineData.days,
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    data: chartLineData.entradas,
                    label: "Entradas",
                    color: "#029739",
                    showMark: true,
                  },
                  {
                    data: chartLineData.salidas,
                    label: "Salidas",
                    color: "#FA7B0A",
                    showMark: true,
                  },
                ]}
                height={280}
              />
            </Box>
          </Box>
        </Box>

        {/* COLUMNA DERECHA */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            minWidth: 0,
            minHeight: 0,
            height: "100%",
            maxHeight: "100%",
            overflow: "hidden",
          }}
        >
          {/* PANEL DE SOLICITUDES */}
          <InfoPanel
            title={`Solicitudes por responder (${
              loading ? "..." : solicitudesAgrupadas.length
            })`}
            loading={loading}
            scrollable
          >
            {solicitudesAgrupadas.length === 0 ? (
              <EmptyState
                icon={CheckCircleIcon}
                title="Todo al día"
                description="No tienes solicitudes pendientes por responder."
              />
            ) : (
              solicitudesAgrupadas.map((grupo) => {
                const esAgrupada = grupo.items.length > 1;

                const primerProducto = grupo.items[0];

                const resumenProductos = grupo.items
                  .slice(0, 2)
                  .map((item) => item.nombre)
                  .join(", ");

                const productosRestantes = Math.max(grupo.items.length - 2, 0);

                const resumenFinal =
                  productosRestantes > 0
                    ? `${resumenProductos}, +${productosRestantes} más`
                    : resumenProductos;

                return (
                  <Box
                    key={grupo.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      py: 1.2,
                      borderBottom: "1px solid #f3f4f6",
                      minWidth: 0,
                    }}
                  >
                    {/* INFORMACIÓN DE SOLICITUD */}
                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Typography
                        fontWeight={600}
                        sx={{
                          color: "#171717",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {esAgrupada
                          ? `${grupo.items.length} productos solicitados`
                          : primerProducto.nombre}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          mt: 0.3,
                          lineHeight: 1.5,
                          overflowWrap: "anywhere",

                          ...(esAgrupada && {
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }),
                        }}
                        title={esAgrupada ? resumenProductos : undefined}
                      >
                        {esAgrupada
                          ? resumenFinal
                          : `${primerProducto.cantidad} ${primerProducto.unit}`}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        backgroundColor: "#FA7B0A",
                        color: "#ffffff",
                        px: 1.5,
                        py: 0.4,
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        flexShrink: 0,
                      }}
                    >
                      {grupo.destino}
                    </Box>
                  </Box>
                );
              })
            )}
          </InfoPanel>

          {/* PANEL DE PRODUCTOS CON BAJO STOCK */}
          <InfoPanel
            title={`Productos con bajo stock (${
              loading ? "..." : stockBajo.length
            })`}
            loading={loading}
            scrollable
          >
            {stockBajo.length === 0 ? (
              <EmptyState
                icon={Inventory2Icon}
                title="Stock óptimo"
                description="No hay productos con bajo inventario actualmente."
              />
            ) : (
              stockBajo.map((p) => (
                <Box
                  key={p.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    py: 1.2,
                    borderBottom: "1px solid #F5F5F4",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#171717",
                      fontWeight: 500,
                      minWidth: 0,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {p.nombre}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#DC2626",
                      flexShrink: 0,
                    }}
                  >
                    {p.cantidad} {p.unit || "pz"}
                  </Typography>
                </Box>
              ))
            )}
          </InfoPanel>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
