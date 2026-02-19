import { useEffect, useState } from "react";

export default function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products")) || []);
  }, []);

  // Calculate summary metrics
  const totalProducts = products.length;
  const totalStock = products.reduce((a, p) => a + p.stock, 0);
  const totalSold = products.reduce((a, p) => a + (p.sold || 0), 0);
  const totalRevenue = products.reduce((a, p) => a + ((p.sold || 0) * p.price), 0);

  // Low stock products
  const lowStock = products.filter(p => p.stock <= 5);

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <h3 className="mb-4 text-primary fw-bold">📊 Dashboard</h3>

      {/* Summary Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-4 bg-white rounded">
            <h6 className="text-secondary mb-2">Total Products</h6>
            <h2 className="fw-bold">{totalProducts}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-4 bg-white rounded">
            <h6 className="text-secondary mb-2">Total Stock</h6>
            <h2 className="fw-bold">{totalStock}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-4 bg-white rounded">
            <h6 className="text-secondary mb-2">Total Sold</h6>
            <h2 className="fw-bold">{totalSold}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-4 bg-white rounded">
            <h6 className="text-secondary mb-2">Total Revenue</h6>
            <h2 className="fw-bold">KSh {totalRevenue.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4 bg-white rounded">
            <h5 className="mb-3 text-primary fw-semibold">Most Sold Products</h5>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "250px", color: "#6c757d" }}>
              Chart goes here
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4 bg-white rounded">
            <h5 className="mb-3 text-primary fw-semibold">Stock Remaining</h5>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "250px", color: "#6c757d" }}>
              Chart goes here
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className="card shadow-sm border-0 p-4 bg-white rounded">
        <h5 className="mb-3 text-primary fw-semibold">Low Stock Products</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Stock Left</th>
                <th>Sold Qty</th>
                <th>Price per Unit</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.length > 0 ? (
                lowStock.map((p, i) => (
                  <tr key={i}>
                    <td>{p.name}</td>
                    <td>{p.stock}</td>
                    <td>{p.sold || 0}</td>
                    <td>KSh {p.price.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-secondary">
                    All products have sufficient stock.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
