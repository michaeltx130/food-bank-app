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

const InventoryTable = ({ products = [], isReplica = false }) => {
  return (
    <TableContainer>
      <Table
        sx={{
          tableLayout: "fixed",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 700,
                color: "#737373",
              }}
            >
              Producto
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 700,
                color: "#737373",
              }}
            >
              Código
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 700,
                color: "#737373",
              }}
            >
              Categoría
            </TableCell>

            {!isReplica && (
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#737373",
                }}
              >
                Cantidad
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isReplica ? 3 : 4}
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
                isReplica={isReplica}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(InventoryTable);
