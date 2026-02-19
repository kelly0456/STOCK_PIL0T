import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg shadow-sm" style={{ backgroundColor: "#00ffff" }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-dark fw-bold" to="/">StockPilot</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-dark fw-semibold" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-semibold" to="/products">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-semibold" to="/sales">Sales</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-semibold" to="/history">History</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
