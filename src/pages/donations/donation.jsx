import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import DonationStatCard from "../../components/donations/DonationStatCard";
import DonationHistoryCard from "../../components/donations/DonationHistoryCard";
import DonationForm from "../../components/donations/DonationForm";
import { Box, Button, Typography } from "@mui/material";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";

const donaciones = [
  { id: 1, donor: "Familia Rodríguez", 
    description: "50 lata de Atún enlatado", 
    date: "2026-04-18" },
  { id: 2, donor: "Supermercados Aramburo",
     description: "100 kg de Arroz",
    date: "2026-04-15" },
  { id: 3, donor: "Pollo pechugon", 
    description: "50 kg de Pollo", 
    date: "2026-04-17" },
];

const Donation = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ padding: "40px", flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h1 style={{ fontSize: "48px", margin: 0 }}>Donaciones</h1>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setOpen(true)}
            sx={{ borderRadius: 3, textTransform: "none", paddingX: 3, paddingY: 1.5 }}
          >
            + Registrar Donacion
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 3, marginBottom: 4 }}>
          <DonationStatCard
            icon={<CardGiftcardOutlinedIcon sx={{ color: "#e07a2f" }} />}
            value={donaciones.length}
            label="Donaciones registradas"
          />
          <DonationStatCard
            icon={<ApartmentOutlinedIcon sx={{ color: "#3b82f6" }} />}
            value={200}
            label="Productos recibidos"
          />
        </Box>

        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 4,
            padding: "32px",
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Historial de Donaciones
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {donaciones.map((d) => (
              <DonationHistoryCard
                key={d.id}
                donor={d.donor}
                description={d.description}
                date={d.date}
              />
            ))}
          </Box>
        </Box>
      </div>

      <DonationForm open={open} setOpen={setOpen} />
    </div>
  );
};

export default Donation;