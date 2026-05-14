import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import BeneficiaryStatCard from "../../components/beneficiaries/BeneficiaryStatCard";
import BeneficiaryCard from "../../components/beneficiaries/BeneficiaryCard";
import BeneficiaryForm from "../../components/beneficiaries/BeneficiaryForm";
import { Box, Button, Typography } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DeliveryForm from "../../components/beneficiaries/DeliveryForm";

const familias = [
  {
    id: 1,
    name: "Familia Hernández",
    contact: "Rosa Hernández",
    members: 5,
    deliveries: 1,
    address: "Col. Centro #123",
    phone: "612-111-2222",
    registeredAt: "2026-01-15",
    history: [{ date: "2026-04-10", items: ["5 kg Arroz", "3 kg Frijol"] }],
  },
  {
    id: 2,
    name: "Familia López",
    contact: "Pedro López",
    members: 3,
    deliveries: 1,
    address: "Col. Pueblo Nuevo #45",
    phone: "612-333-4444",
    registeredAt: "2026-02-20",
    history: [{ date: "2026-04-05", items: ["2 kg Arroz", "1 kg Aceite"] }],
  },
];

const Beneficiaries = () => {
  const [open, setOpen] = useState(false);

  const totalPersonas = familias.reduce((acc, f) => acc + f.members, 0);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState(null);


  const handleNuevaEntrega = (family) => {
    setFamiliaSeleccionada(family);
    setDeliveryOpen(true);
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div style={{ padding: "40px", flex: 1 }}>
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {familias.map((family) => (
            <BeneficiaryCard
              key={family.id}
              family={family}
              onNuevaEntrega={handleNuevaEntrega}
            />
          ))}
        </Box>
      </div>

      <BeneficiaryForm open={open} setOpen={setOpen} />
      <DeliveryForm
        open={deliveryOpen}
        setOpen={setDeliveryOpen}
        family={familiaSeleccionada}
      />
    </div>
  );
};

export default Beneficiaries;
