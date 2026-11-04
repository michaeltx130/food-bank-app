import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";

// Esqueleto de carga interno
const InfoPanelSkeleton = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
      py: 1,
    }}
  >
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

        // Distribución flexible en escritorio.
        flex: { xs: "none", lg: "1 1 0" },

        // En móvil se conserva una altura estable.
        height: { xs: 300, lg: "auto" },
        minHeight: 0,
        minWidth: 0,

        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          padding: "16px !important",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          height: "100%",
          minHeight: 0,
          minWidth: 0,
          flex: 1,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* ENCABEZADO */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#171717",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* CONTENIDO CON SCROLL INTERNO */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflowY: scrollable ? "auto" : "hidden",
            overflowX: "hidden",
            pr: scrollable ? 1 : 0,

            // Scrollbar Firefox
            scrollbarWidth: "thin",
            scrollbarColor: "#A8A29E transparent",

            // Scrollbar Chrome / Edge
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#A8A29E",
              borderRadius: "999px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
          }}
        >
          {loading ? <InfoPanelSkeleton /> : children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfoPanel;
