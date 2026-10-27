import { useEffect, useState, useMemo, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Box, Typography, Skeleton } from "@mui/material";
import StatCard from "../components/dashboard/StatCard";
import InfoPanel from "../components/dashboard/InfoPanel";
import EmptyState from "../components/common/EmptyState";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
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

  const stockBajo = useMemo(() => {
    return products.filter((p) => p.cantidad > 0 && p.cantidad <= 10);
  }, [products]);

  const solicitudesPendientes = useMemo(() => {
    return solicitudes.filter(
      (s) =>
        String(s.aprobacion || "")
          .toLowerCase()
          .trim() === "en_espera",
    );
  }, [solicitudes]);

  // 1. TOP 3 PRODUCTOS MÁS SOLICITADOS (BASADO EN ENTREGAS Y SOLICITUDES SALIENTES)
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

  // 2. ENTRADAS Y SALIDAS INTEGRALES (EXCLUSIVO SEMANA ACTUAL)
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
      if (isNaN(f.getTime()) || f < inicioSemana) return -1;
      const d = f.getDay();
      return d === 0 ? 6 : d - 1;
    };

    donaciones.forEach((d) => {
      const idx = obtenerIndiceSemanaActual(d.fecha || d.created_at);
      if (idx !== -1) entradas[idx] += Number(d.cantidad) || 1;
    });

    products.forEach((p) => {
      if (p.donaciones?.length > 0) return;

      (p.movimientos || []).forEach((m) => {
        if (m.tipo !== "entrada") return;
        const idx = obtenerIndiceSemanaActual(m.fecha);
        if (idx !== -1) entradas[idx] += Number(m.cantidad) || 1;
      });
    });

    entregas.forEach((e) => {
      const idx = obtenerIndiceSemanaActual(e.fecha || e.created_at);
      if (idx !== -1) salidas[idx] += Number(e.cantidad) || 1;
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
        sx={{ fontWeight: 700, mb: 2, color: "#171717" }}
      >
        Dashboard
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.2fr 0.8fr",
          },
          gap: 2,
          width: "100%",
        }}
      >
        {/* COLUMNA IZQUIERDA */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* StatCards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
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

          {/* Gráfica Donut (Top 3) */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, color: "#171717" }}
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
                      position: { vertical: "top", horizontal: "right" },
                    },
                  }}
                />
              ) : (
                <Typography color="text.secondary">
                  Sin registros de solicitudes o entregas.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Gráfica de Líneas */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, color: "#171717" }}
            >
              Entradas y salidas de productos
            </Typography>

            <Box sx={{ height: 300, width: "100%" }}>
              <LineChart
                xAxis={[{ data: chartLineData.days, scaleType: "band" }]}
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
            gap: 2,
            height: "100%",
          }}
        >
          {/* Panel 1: Solicitudes por responder */}
          <InfoPanel
            title={`Solicitudes por responder (${loading ? "..." : solicitudesPendientes.length})`}
            loading={loading}
          >
            {solicitudesPendientes.length === 0 ? (
              <EmptyState
                icon={CheckCircleIcon}
                title="Todo al día"
                description="No tienes solicitudes pendientes por responder."
              />
            ) : (
              solicitudesPendientes.map((s) => (
                <Box
                  key={s.transferencia_id || s.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.2,
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <Box>
                    <Typography fontWeight={600}>
                      {s.producto_nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {s.cantidad} {s.producto?.unit || s.unit || "pz"}
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
                    }}
                  >
                    {s.destino || s.origen}
                  </Box>
                </Box>
              ))
            )}
          </InfoPanel>

          {/* Panel 2: Productos con bajo stock */}
          <InfoPanel
            title={`Productos con bajo stock (${loading ? "..." : stockBajo.length})`}
            loading={loading}
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
                    py: 1.2,
                    borderBottom: "1px solid #F5F5F4",
                  }}
                >
                  <Typography sx={{ color: "#171717", fontWeight: 500 }}>
                    {p.nombre}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#DC2626",
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
