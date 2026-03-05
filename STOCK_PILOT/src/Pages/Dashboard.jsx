import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(savedProducts);

    const savedSales = JSON.parse(localStorage.getItem("salesHistory")) || [];
    setSales(savedSales);
  }, []);

  const getStockColor = (stock) => {
    if (stock === 0) return "#dc3545";        // Red
    if (stock >= 1 && stock <= 15) return "#c142c1";  // Purple
    if (stock >= 16 && stock <= 30) return "#ffc107"; // Yellow
    return "#28a745";                         // Green
  };

  const chartData = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: "Stock Remaining",
        data: products.map(p => p.stock),
        backgroundColor: products.map(p => getStockColor(p.stock)),
        borderRadius: 6
      }
    ]
  };

  const lowStock = products.filter(p => p.stock <= 15);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);

  // 🔹 Calculate total daily revenue from sales
  const today = new Date().toISOString().split("T")[0];
  const dailySales = sales.filter(s => s.date.split("T")[0] === today);
  const dailyRevenue = dailySales.reduce((sum, s) => sum + s.total, 0);

  return (
    <>
      <h3 className="mb-4">Dashboard</h3>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 shadow text-center">
            <h5>Total Products</h5>
            <h3>{totalProducts}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow text-center">
            <h5>Total Stock</h5>
            <h3>{totalStock}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow text-center">
            <h5>Total Sold</h5>
            <h3>{totalSold}</h3>
          </div>
        </div>
      </div>

      {/* Stock Chart */}
      <div className="card p-4 shadow mb-4">
        <Bar data={chartData} />
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="card p-3 shadow border-danger">
          <h5 className="text-danger">⚠ Low Stock Alert</h5>
          <ul>
            {lowStock.map(p => (
              <li key={p.id || p.name}>
                {p.name} — {p.stock} remaining
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔹 Daily Revenue */}
      <div className="card p-3 shadow mt-4">
        <h5 className="text-success">💰 Today's Revenue</h5>
        <h3>KSh {dailyRevenue.toLocaleString()}</h3>
      </div>
    </>
  );
}