import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Request from "./pages/requests/Request";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/requests" element={<Request />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;