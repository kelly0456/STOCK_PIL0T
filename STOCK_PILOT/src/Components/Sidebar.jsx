import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `nav-link fw-semibold mb-2 rounded ${
      location.pathname === path ? "bg-warning text-dark shadow-sm" : "text-white"
    }`;

  return (
    <>
      <div
        className="d-none d-md-flex flex-column flex-shrink-0 p-3 vh-100"
        style={{ backgroundColor: "#1f3b4d", minWidth: "220px" }}
      >
        <h4 className="text-warning text-center mb-4">📦 StockPilot</h4>
        <ul className="nav nav-pills flex-column mb-auto">
          <li><Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link></li>
          <li><Link to="/products" className={linkClass("/products")}>Products</Link></li>
          <li><Link to="/sales" className={linkClass("/sales")}>Sales</Link></li>
          <li><Link to="/history" className={linkClass("/history")}>History</Link></li>
        </ul>
      </div>

      <div className="d-md-none">
        <button
          className="btn btn-outline-warning mb-3"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasSidebar"
        >
          ☰ Menu
        </button>

        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="offcanvasSidebar"
          style={{ backgroundColor: "#1f3b4d" }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title text-warning">📦 StockPilot</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
          </div>
          <div className="offcanvas-body p-3">
            <ul className="nav nav-pills flex-column mb-auto">
              <li><Link data-bs-dismiss="offcanvas" to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link></li>
              <li><Link data-bs-dismiss="offcanvas" to="/products" className={linkClass("/products")}>Products</Link></li>
              <li><Link data-bs-dismiss="offcanvas" to="/sales" className={linkClass("/sales")}>Sales</Link></li>
              <li><Link data-bs-dismiss="offcanvas" to="/history" className={linkClass("/history")}>History</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}