import { useParams, Link } from "react-router-dom";

export default function FeatureDetails() {
  const { feature } = useParams();

  const features = {
    products: {
      title: "📦 Product Management",
      color: "primary",
      description:
        "Manage your inventory efficiently. Add products, update stock levels, monitor availability and receive stock alerts."
    },

    sales: {
      title: "💰 Sales POS",
      color: "success",
      description:
        "Process customer purchases quickly with an intuitive Point of Sale system and automatic calculations."
    },

    dashboard: {
      title: "📊 Dashboard",
      color: "warning",
      description:
        "View business insights, stock statistics, sales performance and revenue summaries in one place."
    },

    reports: {
      title: "📈 Reports & Analytics",
      color: "info",
      description:
        "Generate monthly and yearly reports to track business growth and profitability."
    }
  };

  const item = features[feature];

  if (!item) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Feature not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="card border-0 shadow-lg">

        <div className={`card-header bg-${item.color} text-white`}>
          <h2>{item.title}</h2>
        </div>

        <div className="card-body">

          <p className="lead">
            {item.description}
          </p>

          <div className="row mt-4">

            <div className="col-md-4 mb-3">
              <div className="card bg-light border-0 h-100">
                <div className="card-body">
                  <h5>⚡ Fast Performance</h5>
                  <p>
                    Optimized for quick and reliable business operations.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card bg-light border-0 h-100">
                <div className="card-body">
                  <h5>📱 Easy to Use</h5>
                  <p>
                    Clean interface suitable for businesses of all sizes.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card bg-light border-0 h-100">
                <div className="card-body">
                  <h5>🔒 Secure</h5>
                  <p>
                    Role-based access for administrators and staff.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-4">
            <Link
              to="/register"
              className="btn btn-success me-2"
            >
              Get Started
            </Link>

            <Link
              to="/"
              className="btn btn-outline-secondary"
            >
              Back Home
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}