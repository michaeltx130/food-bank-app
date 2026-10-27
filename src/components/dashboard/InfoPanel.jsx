import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";

// Esqueleto de carga interno
const InfoPanelSkeleton = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, py: 1 }}>
    {[1, 2, 3].map((i) => (
      <Box
        key={i}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 0.5,
        }}
      >
        <Skeleton variant="text" width="55%" height={24} />
        <Skeleton
          variant="rectangular"
          width={65}
          height={22}
          sx={{ borderRadius: "10px" }}
        />
      </Box>
    ))}
  </Box>
);

export const InfoPanel = ({
  title,
  children,
  loading = false,
  scrollable = true,
}) => {
  return (
    <Card
      sx={{
        borderRadius: "12px",
        border: "1px solid #E7E5E4",
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        backgroundColor: "#FFFFFF",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        minHeight: 0,
      }}
    >
      <CardContent
        sx={{
          padding: "16px !important",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <Typography
            sx={{ fontSize: "16px", fontWeight: 700, color: "#171717" }}
          >
            {title}
          </Typography>
        </Box>

        {/* CONTENIDO CON SCROLL */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: scrollable ? "auto" : "visible",
            pr: scrollable ? 1 : 0,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#A8A29E",
              borderRadius: "999px",
            },
            "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
          }}
        >
          {loading ? <InfoPanelSkeleton /> : children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfoPanel;
