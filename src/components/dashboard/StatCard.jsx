import { Card, CardContent, Typography, Box } from "@mui/material";

const StatCard = ({ title, value, description, icon, iconBg, iconColor }) => {
  return (
    <Card
      sx={{
        borderRadius: "22px",
        border: "0.5px solid #E7E5E4",
        boxShadow: "0px 1px 2px rgba(0,0,0,0.04)",
        backgroundColor: "#FFFFFF",
        transition: "0.2s ease",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.06)",
        },
      }}
    >
      <CardContent
        sx={{
          padding: "22px !important",
        }}
      >
        {/* TOP */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 3,
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 500,
              color: "#737373",
            }}
          >
            {title}
          </Typography>

          {/* ICONO */}
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "10px",

              backgroundColor: iconBg,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              color: iconColor,

              "& svg": {
                fontSize: 22,
              },
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* VALUE */}
        <Typography
          sx={{
            fontSize: "48px",
            fontWeight: 700,
            lineHeight: 1,
            color: "#171717",
            marginBottom: 1.5,
          }}
        >
          {value}
        </Typography>

        {/* DESCRIPTION */}
        <Typography
          sx={{
            fontSize: "14px",
            color: "#A3A3A3",
            fontWeight: 500,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
