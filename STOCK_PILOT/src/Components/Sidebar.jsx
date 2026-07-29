import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const fullname = localStorage.getItem("fullname");

  const linkClass = (path) =>
    `nav-link d-flex align-items-center gap-2 rounded px-3 py-2 mb-2 ${
      location.pathname === path
        ? "bg-primary text-white shadow-sm"
        : "text-white"
    }`;

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* ================= Desktop Sidebar ================= */}

      <div
        className="d-none d-md-flex flex-column vh-100 shadow"
        style={{
          width: "250px",
          background: "#1E3A5F",
        }}
      >
        {/* Logo */}

        <div className="text-center py-4 border-bottom border-secondary">

          <h4 className="text-white fw-bold mb-1">
            📦 StockPilot
          </h4>

          <small className="text-light">
            Inventory Management
          </small>

        </div>

        {/* Logged User */}

        <div className="px-3 py-3 border-bottom border-secondary">

          <div className="fw-bold text-white">
            {fullname}
          </div>

          <small className="badge bg-success mt-1">
            {role?.toUpperCase()}
          </small>

        </div>

        {/* Navigation */}

        <ul className="nav flex-column p-3">

          {role === "admin" && (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={linkClass("/dashboard")}
                >
                  <i className="bi bi-speedometer2"></i>
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className={linkClass("/products")}
                >
                  <i className="bi bi-box-seam"></i>
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/employees"
                  className={linkClass("/employees")}
                >
                  <i className="bi bi-people"></i>
                  Employees
                </Link>
              </li>

              <li>
                <Link
                  to="/history"
                  className={linkClass("/history")}
                >
                  <i className="bi bi-clock-history"></i>
                  History
                </Link>
              </li>
            </>
          )}

          <li>
            <Link
              to="/sales"
              className={linkClass("/sales")}
            >
              <i className="bi bi-cart-check"></i>
              Sales
            </Link>
          </li>

        </ul>

        {/* Logout */}

        <div className="mt-auto p-3">

          <button
            className="btn btn-danger w-100"
            onClick={logout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>

        </div>

      </div>

      {/* ================= Mobile Sidebar ================= */}

      <div className="d-md-none">

        <button
          className="btn btn-primary mb-3"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarMenu"
        >
          <i className="bi bi-list"></i> Menu
        </button>

        <div
          className="offcanvas offcanvas-start"
          id="sidebarMenu"
          style={{ background: "#1E3A5F" }}
        >

          <div className="offcanvas-header">

            <h5 className="text-white">
              📦 StockPilot
            </h5>

            <button
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
            ></button>

          </div>

          <div className="offcanvas-body">

            <div className="mb-4">

              <div className="fw-bold text-white">
                {fullname}
              </div>

              <small className="badge bg-success">
                {role?.toUpperCase()}
              </small>

            </div>

            <ul className="nav flex-column">

              {role === "admin" && (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className={linkClass("/dashboard")}
                      data-bs-dismiss="offcanvas"
                    >
                      <i className="bi bi-speedometer2"></i>
                      Dashboard
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/products"
                      className={linkClass("/products")}
                      data-bs-dismiss="offcanvas"
                    >
                      <i className="bi bi-box-seam"></i>
                      Products
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/employees"
                      className={linkClass("/employees")}
                      data-bs-dismiss="offcanvas"
                    >
                      <i className="bi bi-people"></i>
                      Employees
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/history"
                      className={linkClass("/history")}
                      data-bs-dismiss="offcanvas"
                    >
                      <i className="bi bi-clock-history"></i>
                      History
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link
                  to="/sales"
                  className={linkClass("/sales")}
                  data-bs-dismiss="offcanvas"
                >
                  <i className="bi bi-cart-check"></i>
                  Sales
                </Link>
              </li>

            </ul>

            <button
              className="btn btn-danger w-100 mt-4"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>

          </div>

        </div>

      </div>
    </>
  );
}