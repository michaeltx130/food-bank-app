import React from "react";

import { TableRow, TableCell, Box, Typography, Button } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SendIcon from "@mui/icons-material/Send";

const InventoryRow = ({
  product,
  showRequestButton = false,
  onRequest,
  branchName,
}) => {
  const handleRequest = () => {
    if (!onRequest) return;
    onRequest(product, branchName);
  };

  return (
    <TableRow
      hover
      sx={{
        "& td": {
          borderBottom: "1px solid #F5F5F4",
        },
      }}
    >
      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "12px",
              backgroundColor: "#FFF7ED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F97316",
            }}
          >
            <Inventory2Icon />
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#171717",
            }}
          >
            {product.name}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>{product.id}</TableCell>

      <TableCell>{product.category}</TableCell>

      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: "#171717",
            }}
          >
            {product.quantity}
          </Typography>
          <Typography
            sx={{
              color: "#737373",
            }}
          >
            {product.unit}
          </Typography>
        </Box>
      </TableCell>
      {showRequestButton && (
        <TableCell>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleRequest}
            sx={{
              backgroundColor: "#F97316",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { backgroundColor: "#EA580C", boxShadow: "none" },
            }}
          >
            Solicitar
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};

export default React.memo(InventoryRow);
