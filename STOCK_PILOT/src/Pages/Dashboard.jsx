import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products")) || []);
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((a, p) => a + p.stock, 0);
  const totalSold = products.reduce((a, p) => a + (p.sold || 0), 0);
  const totalRevenue = products.reduce((a, p) => a + ((p.sold || 0) * p.price), 0);

  const stockColor = (stock) => {
    if (stock === 0) return "#dc3545"; // Red
    if (stock <= 15) return "#800000"; // Maroon
    if (stock <= 30) return "#ffc107"; // Dark Yellow
    return "#28a745"; // Green
  };

  // Data for Stock Remaining Pie Chart
  const pieData = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: "Stock Remaining",
        data: products.map(p => p.stock),
        backgroundColor: products.map(p => stockColor(p.stock))
      }
    ]
  };

  // Data for Most Sold Products Bar Chart
  const barData = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: "Units Sold",
        data: products.map(p => p.sold || 0),
        backgroundColor: "#007bff"
      }
    ]
  };

  const formatKES = (n) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(n);

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
            <h2 className="fw-bold">{formatKES(totalRevenue)}</h2>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4 bg-white rounded">
            <h5 className="mb-3 text-primary fw-semibold">Most Sold Products</h5>
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4 bg-white rounded">
            <h5 className="mb-3 text-primary fw-semibold">Stock Remaining</h5>
            <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
          </div>
        </div>
      </div>
    </div>
  );
}