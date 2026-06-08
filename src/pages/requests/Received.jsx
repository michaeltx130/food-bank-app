import { useEffect, useState } from "react";
import RequestCard from "../../components/requests/RequestCard";
import { Box, Typography, CircularProgress, Pagination } from "@mui/material";

import {
  getSolicitudesRecibidas,
  aprobarSolicitud,
  rechazarSolicitud,
} from "../../services/api";

const Received = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSolicitudesRecibidas();
      setSolicitudes(data);
    } catch (error) {
      console.error("Error obteniendo solicitudes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAprobar = async (
  id,
  origen
) => {
    console.log("APROBAR:", id, origen);
  try {
    await aprobarSolicitud(
      id,
      origen
    );

    fetchData();
  } catch (error) {
    console.error(
      "Error aprobando:",
      error
    );
  }
};

const handleRechazar = async (
  id,
  origen
) => {
  try {
    await rechazarSolicitud(
      id,
      origen
    );

    fetchData();
  } catch (error) {
    console.error(
      "Error rechazando:",
      error
    );
  }
};
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSolicitudes = solicitudes.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(solicitudes.length / itemsPerPage);

  if (loading) {
    return <CircularProgress sx={{ mt: 4 }} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {solicitudes.length === 0 ? (
        <Typography color="text.secondary">
          No hay solicitudes recibidas.
        </Typography>
      ) : (
        <>
          {currentSolicitudes.map((s, index) => (
  <RequestCard
    key={s.transferencia_id || `${s.origen}-${s.destino}-${index}`}
    solicitud={s}
    type="received"
    onAprobar={() =>
      handleAprobar(
        s.transferencia_id,
        s.origen
      )
    }
    onRechazar={() =>
      handleRechazar(
        s.transferencia_id,
        s.origen
      )
    }
  />
))}

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Received;