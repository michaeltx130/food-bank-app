import { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, Pagination, Skeleton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MainLayout from "../../components/layout/MainLayout";
import DonationStatCard from "../../components/donations/DonationStatCard";
import DonationHistoryCard from "../../components/donations/DonationHistoryCard";
import DonationForm from "../../components/donations/DonationForm";
import EmptyState from "../../components/common/EmptyState";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { getDonaciones } from "../../services/api";
import { BarChart } from "@mui/x-charts/BarChart";

const Donation = () => {
  const [open, setOpen] = useState(false);
  const [rawDonaciones, setRawDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchDonaciones = async () => {
    setLoading(true);
    try {
      const data = await getDonaciones();
      setRawDonaciones(data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error cargando donaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let activo = true;

    getDonaciones()
      .then((data) => {
        if (activo) setRawDonaciones(data || []);
      })
      .catch((error) => {
        if (activo) console.error("Error cargando donaciones:", error);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  // 1. Agrupación por donante y fecha de creación en ventana de 10 segundos
  const donacionesAgrupadas = useMemo(() => {
    const VENTANA_MS = 10000;
    const grupos = [];

    [...rawDonaciones]
      .sort(
        (a, b) =>
          new Date(b.fecha || b.created_at) - new Date(a.fecha || a.created_at),
      )
      .forEach((d) => {
        const fecha = new Date(d.fecha || d.created_at);
        if (isNaN(fecha.getTime())) return;
        const fechaStr = [
          fecha.getFullYear(),
          String(fecha.getMonth() + 1).padStart(2, "0"),
          String(fecha.getDate()).padStart(2, "0"),
        ].join("-");
        const tiempo = fecha.getTime();
        const donante = d.donante || "Desconocido";

        let grupo = grupos.find(
          (g) =>
            g.donor === donante &&
            g.date === fechaStr &&
            Math.abs(g.tiempo - tiempo) <= VENTANA_MS,
        );

        if (!grupo) {
          grupo = {
            id: `${donante}_${d.fecha || d.created_at}_${d.id}`,
            donor: donante,
            date: fechaStr,
            tiempo,
            items: [],
          };
          grupos.push(grupo);
        }

        grupo.items.push({
          nombre: d.producto?.nombre || "Producto",
          cantidad: d.cantidad,
          unit: d.producto?.unit || "pz",
        });
      });

    return grupos;
  }, [rawDonaciones]);

  // Contar tipos de productos distintos, sin sumar cantidades de diferentes unidades.
  const totalProductos = new Set(
    rawDonaciones
      .map((d) => d.producto?.nombre?.trim().toLowerCase())
      .filter(Boolean),
  ).size;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDonaciones = donacionesAgrupadas.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(donacionesAgrupadas.length / itemsPerPage);

  // 2. CÁLCULO DINÁMICO DE DONACIONES RECIBIDAS (SEMANA ACTUAL DE LUNES A DOMINGO)
  const chartDataCalculada = useMemo(() => {
    const conteoPorDia = [0, 0, 0, 0, 0, 0, 0];

    const ahora = new Date();
    const diaSemanaActual = ahora.getDay(); // 0 = Domingo, 1 = Lunes...
    const distanciaAlLunes = diaSemanaActual === 0 ? 6 : diaSemanaActual - 1;

    const inicioSemana = new Date(ahora);
    inicioSemana.setDate(ahora.getDate() - distanciaAlLunes);
    inicioSemana.setHours(0, 0, 0, 0);

    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 7);

    // La gráfica cuenta donaciones agrupadas, no cantidades de productos.
    donacionesAgrupadas.forEach((donacion) => {
      const fecha = new Date(donacion.tiempo);
      if (fecha < inicioSemana || fecha >= finSemana) return;

      const dia = fecha.getDay();
      const indice = dia === 0 ? 6 : dia - 1;
      conteoPorDia[indice] += 1;
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
      values: conteoPorDia,
    };
  }, [donacionesAgrupadas]);

  return (
    <MainLayout>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}
      >
        {/* HEADER SECTION */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            minHeight: "44px",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#171717" }}>
            Donaciones
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
              paddingX: 2.5,
              paddingY: 1,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#15803d",
                boxShadow: "none",
              },
            }}
          >
            Registrar donación
          </Button>
        </Box>

        {/* STATS & CHART SECTION */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "264px 1fr" },
            gap: "32px",
            alignItems: "stretch",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <DonationStatCard
              value={donacionesAgrupadas.length}
              label="Donaciones totales"
            />
            <DonationStatCard
              value={totalProductos}
              label="Productos recibidos"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "20px",
                color: "#171717",
                mb: 0.5,
              }}
            >
              Donaciones recibidas
            </Typography>

            <Box sx={{ width: "100%", height: 210 }}>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: chartDataCalculada.days,
                    categoryGapRatio: 0.65,
                  },
                ]}
                series={[{ data: chartDataCalculada.values, color: "#029739" }]}
                height={210}
                margin={{ top: 15, bottom: 25, left: 25, right: 10 }}
              />
            </Box>
          </Box>
        </Box>

        {/* HISTORIAL */}
        <Box sx={{ width: "100%", marginTop: 1 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "20px",
              color: "#171717",
              marginBottom: 1,
            }}
          >
            Historial de donaciones
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height={60} />
              ))}
            </Box>
          ) : donacionesAgrupadas.length === 0 ? (
            <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
              <EmptyState
                icon={VolunteerActivismIcon}
                title="Sin donaciones registradas"
                description="Aún no se han registrado donaciones de alimentos o insumos."
              />
            </Box>
          ) : (
            <>
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                {currentDonaciones.map((d, index) => (
                  <DonationHistoryCard
                    key={d.id}
                    donor={d.donor}
                    items={d.items}
                    date={d.date}
                    isLast={index === currentDonaciones.length - 1}
                  />
                ))}
              </Box>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, value) => setCurrentPage(value)}
                    sx={{
                      "& .MuiPaginationItem-root.Mui-selected": {
                        backgroundColor: "#029739",
                        color: "#ffffff",
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

      <DonationForm open={open} setOpen={setOpen} onSuccess={fetchDonaciones} />
    </MainLayout>
  );
};

export default Donation;
