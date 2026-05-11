import React from "react";

import { Card, CardContent, Typography, Box } from "@mui/material";

const InfoPanel = ({ title, icon, children }) => {
  return (
    <Card
      sx={{
        borderRadius: "24px",
        border: "1px solid #E7E5E4",
        boxShadow: "0px 1px 2px rgba(0,0,0,0.04)",
        backgroundColor: "#FFFFFF",
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

        {/* Content */}
        <Box>{children}</Box>
      </CardContent>
    </Card>
  );
};

export default InfoPanel;
