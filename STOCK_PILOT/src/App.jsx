import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import AdminRoute from "./Components/AdminRoute";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import FeatureDetails from "./Pages/FeatureDetails";

import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Sales from "./Pages/Sales";
import History from "./Pages/History";
import Employees from "./Pages/Employees";

function AppLayout() {

  const location = useLocation();

  const publicPages = [
    "/",
    "/login",
    "/register",
  ];

  const isFeaturePage =
    location.pathname.startsWith("/feature/");

  const showSidebar =
    !publicPages.includes(location.pathname) &&
    !isFeaturePage;

  return (
    <div className="d-flex flex-column vh-100">

      {/* Top Navbar */}
      <Navbar />

      <div className="d-flex flex-grow-1">

        {/* Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Main Content */}
        <div
          className="flex-grow-1 p-4"
          style={{
            backgroundColor: "#f8f9fa",
            overflowY: "auto",
          }}
        >

          <Routes>

            {/* ================= PUBLIC ================= */}

            <Route path="/" element={<Home />} />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* Feature Preview */}

            <Route
              path="/feature/:feature"
              element={<FeatureDetails />}
            />

            {/* ================= ADMIN ================= */}

            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/products"
              element={
                <AdminRoute>
                  <Products />
                </AdminRoute>
              }
            />

            <Route
              path="/history"
              element={
                <AdminRoute>
                  <History />
                </AdminRoute>
              }
            />

            <Route
              path="/employees"
              element={
                <AdminRoute>
                  <Employees />
                </AdminRoute>
              }
            />

            {/* ================= SHARED ================= */}

            <Route
              path="/sales"
              element={<Sales />}
            />

            {/* ================= 404 ================= */}

            <Route
              path="*"
              element={
                <div className="text-center mt-5">

                  <h2 className="text-danger">
                    404 - Page Not Found
                  </h2>

                  <p className="text-muted">
                    The page you're looking for doesn't exist.
                  </p>

                </div>
              }
            />

          </Routes>

        </div>

      </div>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}