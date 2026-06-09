import React from "react";

import { Card, CardContent, Typography, Box } from "@mui/material";

const InfoPanel = ({
  title,
  icon,
  children,
  maxHeight = 285,
  scrollable = true,
}) => {
  return (
    <Card
      sx={{
        borderRadius: "24px",
        border: "1px solid #E7E5E4",
        boxShadow: "0px 1px 2px rgba(0,0,0,0.04)",
        backgroundColor: "#FFFFFF",
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          padding: "24px !important",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            marginBottom: 3,
          }}
        >
          {icon}

          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#171717",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Content Scroll */}
        <Box
          sx={{
            maxHeight: scrollable ? maxHeight : "none",
            overflowY: scrollable ? "auto" : "visible",
            pr: scrollable ? 1 : 0,

            "&::-webkit-scrollbar": {
              width: "8px",
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
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfoPanel;
