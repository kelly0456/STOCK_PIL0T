import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark shadow-sm" style={{ backgroundColor: "#1f3b4d" }}>
      <div className="container-fluid justify-content-center">
        <Link className="navbar-brand fw-bold text-warning fs-4" to="/">
          StockPilot
        </Link>
      </div>
    </nav>
  );
}