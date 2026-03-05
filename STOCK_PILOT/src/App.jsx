import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

        {/* Top Navigation */}
        <Navbar />

        {/* Main Layout */}
        <div className="d-flex flex-grow-1">

          {/* Sidebar */}
          <Sidebar />

          {/* Page Content */}
          <div
            className="flex-grow-1 p-4"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <Routes>

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Main Pages */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/history" element={<History />} />

              {/* 404 Fallback */}
              <Route
                path="*"
                element={<h4 className="text-danger">404 - Page Not Found</h4>}
              />

            </Routes>
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}