import RequestCard from "../../components/requests/RequestCard";

import { Box } from "@mui/material";

const Received = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <RequestCard />
    </Box>
  );
};

export default Received;