import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import BeneficiaryStatCard from "../../components/beneficiaries/BeneficiaryStatCard";
import BeneficiaryCard from "../../components/beneficiaries/BeneficiaryCard";
import BeneficiaryForm from "../../components/beneficiaries/BeneficiaryForm";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DeliveryForm from "../../components/beneficiaries/DeliveryForm";
import { getBeneficiarios } from "../../services/api";

const Beneficiaries = () => {
  const [open, setOpen] = useState(false);
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState(null);

  const fetchBeneficiarios = async () => {
  const data = await getBeneficiarios();
  const mapped = data.map((b) => ({
    ...b,
    name: b.nombre,
    members: b.familia?.cantidad_miembros ?? 0,
    deliveries: b.entregas?.length ?? 0,
    history: b.entregas?.map((e) => ({
      date: new Date(e.fecha).toLocaleDateString("es-MX"),
      items: [`${e.cantidad} ${e.producto?.nombre ?? "producto"}`],
    })) ?? [],
  }));
  setFamilias(mapped);
  setLoading(false);
};

useEffect(() => {
  fetchBeneficiarios();
}, []);
  const totalPersonas = familias.reduce((acc, f) => acc + (f.members ?? 0), 0);

  const handleNuevaEntrega = (family) => {
    setFamiliaSeleccionada(family);
    setDeliveryOpen(true);
  };

  return (
     <div style={{ display: "flex", backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
       <Sidebar />

       <div style={{ padding: "40px", flex: 1, overflowY: "auto", height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 1,
          }}
        >
          <Box>
            <h1 style={{ fontSize: "48px", margin: 0 }}>Beneficiarios</h1>
            <Typography color="text.secondary" fontSize="15px">
              Gestiona los beneficiarios registrados y sus entregas
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              paddingX: 3,
              paddingY: 1.5,
              marginTop: 1,
            }}
          >
            + Registrar Familia
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 3, marginBottom: 4, marginTop: 4 }}>
          <BeneficiaryStatCard
            icon={<PeopleAltOutlinedIcon sx={{ color: "#e07a2f" }} />}
            value={familias.length}
            label="Familias registradas"
          />
          <BeneficiaryStatCard
            icon={<PersonOutlineOutlinedIcon sx={{ color: "#3b82f6" }} />}
            value={totalPersonas}
            label="Personas beneficiadas"
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
            <CircularProgress color="warning" />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {familias.map((family) => (
              <BeneficiaryCard
                key={family.id}
                family={family}
                onNuevaEntrega={handleNuevaEntrega}
              />
            ))}
          </Box>
        )}
      </div>

     <BeneficiaryForm open={open} setOpen={setOpen} onSuccess={fetchBeneficiarios} />
      <DeliveryForm
        open={deliveryOpen}
        setOpen={setDeliveryOpen}
        family={familiaSeleccionada}
        onSuccess={fetchBeneficiarios}
      />
    </div>
  );
};

export default Beneficiaries;