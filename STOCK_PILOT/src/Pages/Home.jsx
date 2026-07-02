import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream text-primary py-5">
        <div className="container text-center">

          <h1 className="display-2 fw-bold">
            📦 StockPilot
          </h1>

          <p className="lead mt-3">
            Smart Inventory, Sales & Reporting System
            for Modern Businesses.
          </p>

          <div className="mt-4">
            <Link
              to="/login"
              className="btn btn-success btn-lg me-3"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-warning btn-lg"
            >
              Get Started
            </Link>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="container py-5">

        <div className="row text-center g-4">

          <div className="col-md-3">
            <div className="card border-0 shadow h-100">
              <div className="card-body">
                <h1 className="text-primary">500+</h1>
                <p className="mb-0">Products Managed</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow h-100">
              <div className="card-body">
                <h1 className="text-success">10K+</h1>
                <p className="mb-0">Sales Recorded</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow h-100">
              <div className="card-body">
                <h1 className="text-warning">98%</h1>
                <p className="mb-0">Stock Accuracy</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow h-100">
              <div className="card-body">
                <h1 className="text-danger">24/7</h1>
                <p className="mb-0">Monitoring</p>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Features */}
      <section className="container pb-5">

        <h2 className="text-center fw-bold mb-5">
          Powerful Features
        </h2>

        <div className="row g-4">

          <div className="col-md-3">
            <Link
              to="/feature/products"
              className="text-decoration-none"
            >
              <div className="card feature-card h-100 shadow border-0">
                <div className="card-body text-center">
                  <h1>📦</h1>
                  <h5 className="text-primary">
                    Products
                  </h5>

                  <p className="text-muted">
                    Manage stock levels and inventory.
                  </p>

                  <button className="btn btn-outline-primary">
                    Learn More
                  </button>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link
              to="/feature/sales"
              className="text-decoration-none"
            >
              <div className="card feature-card h-100 shadow border-0">
                <div className="card-body text-center">
                  <h1>💰</h1>
                  <h5 className="text-success">
                    Sales POS
                  </h5>

                  <p className="text-muted">
                    Fast and reliable checkout system.
                  </p>

                  <button className="btn btn-outline-success">
                    Learn More
                  </button>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link
              to="/feature/dashboard"
              className="text-decoration-none"
            >
              <div className="card feature-card h-100 shadow border-0">
                <div className="card-body text-center">
                  <h1>📊</h1>
                  <h5 className="text-warning">
                    Dashboard
                  </h5>

                  <p className="text-muted">
                    Business insights and monitoring.
                  </p>

                  <button className="btn btn-outline-warning">
                    Learn More
                  </button>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link
              to="/feature/reports"
              className="text-decoration-none"
            >
              <div className="card feature-card h-100 shadow border-0">
                <div className="card-body text-center">
                  <h1>📈</h1>
                  <h5 className="text-info">
                    Reports
                  </h5>

                  <p className="text-muted">
                    Monthly and yearly analytics.
                  </p>

                  <button className="btn btn-outline-info">
                    Learn More
                  </button>
                </div>
              </div>
            </Link>
          </div>

        </div>

      </section>

      {/* Why Choose */}
      <section className="bg-light py-5">

        <div className="container">

          <h2 className="text-center fw-bold mb-5">
            Why Choose StockPilot?
          </h2>

          <div className="row g-4">

            <div className="col-md-4">
              <div className="card border-0 shadow h-100">
                <div className="card-body">
                  <h4>⚡ Fast Sales</h4>
                  <p>
                    Process customer transactions in seconds.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow h-100">
                <div className="card-body">
                  <h4>🔔 Low Stock Alerts</h4>
                  <p>
                    Never run out of stock unexpectedly.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow h-100">
                <div className="card-body">
                  <h4>📊 Smart Analytics</h4>
                  <p>
                    Make informed business decisions using reports.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="container py-5">

        <div className="card border-0 shadow-lg bg-primary text-white">

          <div className="card-body text-center p-5">

            <h2>
              Ready to Grow Your Business?
            </h2>

            <p className="lead">
              Join thousands of businesses using StockPilot.
            </p>

            <Link
              to="/register"
              className="btn btn-warning btn-lg"
            >
              Start Free
            </Link>

          </div>

        </div>

      </section>
    </>
  );
}