import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `nav-link fw-semibold text-dark mb-2 rounded ${
      location.pathname === path ? "bg-light shadow-sm" : ""
    }`;

  return (
    <>
      {/* Sidebar for md+ screens */}
      <div
        className="d-none d-md-flex flex-column flex-shrink-0 p-3 vh-100"
        style={{ backgroundColor: "#00ffff", minWidth: "200px" }}
      >
        <Link
          to="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none"
        >
          <span className="fs-4 fw-bold text-dark">StockPilot</span>
        </Link>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li>
            <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
          </li>
          <li>
            <Link to="/products" className={linkClass("/products")}>Products</Link>
          </li>
          <li>
            <Link to="/sales" className={linkClass("/sales")}>Sales</Link>
          </li>
          <li>
            <Link to="/history" className={linkClass("/history")}>History</Link>
          </li>
        </ul>
      </div>

      {/* Offcanvas Sidebar for small screens */}
      <div className="d-md-none">
        <button
          className="btn btn-outline-dark mb-3"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasSidebar"
          aria-controls="offcanvasSidebar"
        >
          ☰ Menu
        </button>

        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="offcanvasSidebar"
          aria-labelledby="offcanvasSidebarLabel"
          style={{ backgroundColor: "#073131" }  }
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title text-dark fw-bold" id="offcanvasSidebarLabel">
              📦StockPilot
            </h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body p-3">
            <ul className="nav nav-pills flex-column mb-auto">
              <li>
                <Link data-bs-dismiss="offcanvas" to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
              </li>
              <li>
                <Link data-bs-dismiss="offcanvas" to="/products" className={linkClass("/products")}>Products</Link>
              </li>
              <li>
                <Link data-bs-dismiss="offcanvas" to="/sales" className={linkClass("/sales")}>Sales</Link>
              </li>
              <li>
                <Link data-bs-dismiss="offcanvas" to="/history" className={linkClass("/history")}>History</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
