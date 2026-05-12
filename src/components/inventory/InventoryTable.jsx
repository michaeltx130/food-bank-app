import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import InventoryRow from "./InventoryRow";

const InventoryTable = ({
  products,
  showRequestButton = false,
  onRequest,
  branchName,
}) => {
  return (
    <TableContainer>
      <Table
        sx={{
          tableLayout: "fixed",
        }}
      >
        {/* Header */}
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                color: "#737373",
              }}
            >
              Producto
            </TableCell>

            <TableCell
              sx={{
                fontWeight: "bold",
                color: "#737373",
              }}
            >
              Código
            </TableCell>

            <TableCell
              sx={{
                fontWeight: "bold",
                color: "#737373",
              }}
            >
              Categoría
            </TableCell>

            <TableCell
              sx={{
                fontWeight: "bold",
                color: "#737373",
              }}
            >
              Cantidad
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Body */}
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showRequestButton ? 5 : 4}
                align="center"
                sx={{
                  paddingY: 6,
                  color: "#A3A3A3",
                  fontSize: "15px",
                  borderBottom: "none",
                }}
              >
                Sin productos registrados
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <InventoryRow
                key={product.id}
                product={product}
                showRequestButton={showRequestButton}
                onRequest={onRequest}
                branchName={branchName}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;
