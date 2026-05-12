import React from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ApartmentIcon from "@mui/icons-material/Apartment";
import InventoryTable from "../inventory/InventoryTable";

const BranchCard = ({ branch, onRequest }) => {
  return (
    <Accordion
      sx={{
        borderRadius: "24px !important",
        overflow: "hidden",
        boxShadow: "0px 1px 2px rgba(0,0,0,0.04)",
        border: "1px solid #E7E5E4",
        marginBottom: 3,
      }}
    >
      {/* Header */}
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            width: "100%",

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "14px",
                backgroundColor: "#FFF7ED",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                color: "#F97316",
              }}
            >
              <ApartmentIcon />
            </Box>
            {/* Name */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "20px",
                color: "#171717",
              }}
            >
              {branch.branchName}
            </Typography>
          </Box>
          {/* Right */}
          <Box
            sx={{
              textAlign: "right",
              marginRight: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "32px",
                color: "#171717",
              }}
            >
              {branch.products.length}
            </Typography>
            <Typography
              sx={{
                color: "#A3A3A3",
                fontSize: "14px",
              }}
            >
              productos totales
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      {/* Table */}
      <AccordionDetails>
        <InventoryTable
          products={branch.products}
          showRequestButton
          onRequest={onRequest}
          branchName={branch.branchName}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default BranchCard;
