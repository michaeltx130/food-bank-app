import React from "react";

import { TableRow, TableCell, Box, Typography, Button } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SendIcon from '@mui/icons-material/Send';

const InventoryRow = ({ product, showRequestButton = false }) => {
  return (
    <TableRow
      hover
      sx={{
        "& td": {
          borderBottom: "1px solid #F5F5F4",
        },
      }}
    >
      {/* Producto */}
      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Icono */}
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

          {/* Nombre */}
          <Typography
            sx={{
              fontWeight: "bold",
              color: "#171717",
            }}
          >
            {product.name}
          </Typography>
        </Box>
      </TableCell>

      {/* Código */}
      <TableCell>{product.id}</TableCell>

      {/* Categoría */}
      <TableCell>{product.category}</TableCell>

      {/* Cantidad */}
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
              fontWeight: "bold",
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

      {/* Request Button */}
      {showRequestButton && (
        <TableCell>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            sx={{
              backgroundColor: "#F97316",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: "bold",

              "&:hover": {
                backgroundColor: "#EA580C",
              },
            }}
          >
            Solicitar
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};

export default InventoryRow;
