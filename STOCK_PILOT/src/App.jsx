import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";

import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Sales from "./Pages/Sales";
import History from "./Pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column vh-100">
        {/* Navbar */}
        <Navbar />

        {/* Body */}
        <div className="d-flex flex-grow-1">
          <Sidebar />

          <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
