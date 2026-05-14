import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import NetworkInventory from "./pages/NetworkInventory";
import Request from "./pages/requests/Request";
import Donation from "./pages/donations/donation";
import Beneficiary from "./pages/beneficiaries/Beneficiaries";

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/inventory"
          element={<Inventory />}
        />

        <Route
          path="/network"
          element={<NetworkInventory />}
        />

        <Route
          path="/requests"
          element={<Request />}
        />
        <Route
          path="/"
          element={<Request />}
        />
        <Route
         path="/Donations"
         element={<Donation />}
        />
        <Route
         path="/beneficiaries"
         element={<Beneficiary />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;