import React from "react";
import { TextField, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <SearchIcon
        sx={{
          position: "absolute",
          left: "16px",
          color: "#A3A3A3",
          fontSize: 22,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar productos"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            backgroundColor: "#FFFFFF",
            paddingLeft: "40px",

            "& fieldset": {
              borderColor: "#E7E5E4",
            },
            "&:hover fieldset": {
              borderColor: "#D6D3D1",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3480de",
            },
          },
          "& .MuiInputBase-input": {
            paddingY: "14px",
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
