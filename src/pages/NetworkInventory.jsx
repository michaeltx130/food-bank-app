import React from "react";

import { Box, Typography } from "@mui/material";
import Sidebar from "../components/layout/Sidebar";
import SearchBar from "../components/inventory/SearchBar";
import BranchCard from "../components/network/BranchCard";

const NetworkInventory = () => {

  const branches = [
    {
      id: 1,
      branchName: "Loreto",
      //Aqui ps ajá, se obtendran los productos del backend
      products: [],
    },

    {
      id: 2,
      branchName: "Comondú",
      //Aqui ps ajá, se obtendran los productos del backend
      products: [],
    },

    {
      id: 3,
      branchName: "Mulegé",
      //Aqui ps ajá, se obtendran los productos del backend
      products: [],
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          backgroundColor: "#F9FAFB",
          overflowY: "auto",
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#171717",
            marginBottom: 4,
          }}
        >
          Red de Inventarios
        </Typography>

        {/* Sticky Search */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#F9FAFB",
            paddingBottom: 2,
            marginBottom: 3,
          }}
        >
          <SearchBar placeholder="Buscar productos en la red" />
        </Box>

        {/* Branches */}
        {branches.map((branch) => (
          <BranchCard key={branch.id} branch={branch} />
        ))}
      </Box>
    </Box>
  );
};

export default NetworkInventory;
