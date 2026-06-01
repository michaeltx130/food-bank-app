import { useEffect, useState } from "react";
import RequestCard from "../../components/requests/RequestCard";
import {
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

import {
  getSolicitudesRecibidas,
  aprobarSolicitud,
  rechazarSolicitud,
} from "../../services/api";

const Received = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    try {
      const data = await getSolicitudesRecibidas();
      setSolicitudes(data);
    } catch (error) {
      console.error(
        "Error obteniendo solicitudes:",
        error
      );
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

  if (loading) {
    return (
      <CircularProgress
        sx={{ mt: 4 }}
      />
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {solicitudes.length === 0 ? (
        <Typography color="text.secondary">
          No hay solicitudes recibidas.
        </Typography>
      ) : (
        solicitudes.map((s, index) => (
  <RequestCard
    key={
      s.transferencia_id ||
      `${s.origen}-${s.destino}-${index}`
    }
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
))
      )}
    </Box>
  );
};

export default Received;