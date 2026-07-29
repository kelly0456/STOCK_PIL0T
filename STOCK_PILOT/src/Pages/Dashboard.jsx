import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(res.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "#dc3545";
    if (stock <= 15) return "#c142c1";
    if (stock <= 30) return "#ffc107";
    return "#28a745";
  };

  const chartData = {
    labels: products.map((p) => p.name),
    datasets: [
      {
        label: "Stock Remaining",
        data: products.map((p) => p.stock),
        backgroundColor: products.map((p) =>
          getStockColor(p.stock)
        ),
        borderRadius: 6,
      },
    ],
  };

  const lowStock = products.filter(
    (p) => p.stock <= 15
  );

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, p) => sum + p.stock,
    0
  );

  const totalSold = products.reduce(
    (sum, p) => sum + (p.sold || 0),
    0
  );

  const totalRevenue = products.reduce(
    (sum, p) => sum + (p.price * (p.sold || 0)),
    0
  );

  const outOfStock = products.filter(
    (p) => p.stock === 0
  );

  const topSelling = [...products]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);

  return (
    <>
      <h3 className="mb-4 fw-bold">
        Dashboard
      </h3>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <>
          {/* Statistics */}

          <div className="row g-4 mb-4">

            <div className="col-md-3">
              <div className="card shadow border-0 text-center p-3">
                <h6 className="text-muted">
                  Total Products
                </h6>
                <h2>{totalProducts}</h2>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow border-0 text-center p-3">
                <h6 className="text-muted">
                  Total Stock
                </h6>
                <h2>{totalStock}</h2>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow border-0 text-center p-3">
                <h6 className="text-muted">
                  Total Sold
                </h6>
                <h2>{totalSold}</h2>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow border-0 text-center p-3">
                <h6 className="text-muted">
                  Revenue
                </h6>
                <h2>KES {totalRevenue.toLocaleString()}</h2>
              </div>
            </div>

          </div>

          {/* Chart */}

          <div className="card shadow border-0 p-4 mb-4">
            <h5 className="mb-3">
              Stock Overview
            </h5>

            <Bar data={chartData} />
          </div>

          <div className="row">

            {/* Low Stock */}

            <div className="col-lg-6">

              <div className="card shadow border-danger mb-4">

                <div className="card-body">

                  <h5 className="text-danger">
                    ⚠ Low Stock Alert
                  </h5>

                  {lowStock.length === 0 ? (
                    <p className="text-success mb-0">
                      All products are sufficiently stocked.
                    </p>
                  ) : (
                    <ul className="mb-0">
                      {lowStock.map((p) => (
                        <li key={p._id}>
                          {p.name} — {p.stock} remaining
                        </li>
                      ))}
                    </ul>
                  )}

                </div>

              </div>

            </div>

            {/* Out of Stock */}

            <div className="col-lg-6">

              <div className="card shadow border-warning mb-4">

                <div className="card-body">

                  <h5 className="text-warning">
                    📦 Out of Stock
                  </h5>

                  {outOfStock.length === 0 ? (
                    <p className="text-success mb-0">
                      No out-of-stock products.
                    </p>
                  ) : (
                    <ul className="mb-0">
                      {outOfStock.map((p) => (
                        <li key={p._id}>
                          {p.name}
                        </li>
                      ))}
                    </ul>
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* Top Selling */}

          <div className="card shadow border-0 mb-4">

            <div className="card-body">

              <h5 className="mb-3">
                🔥 Top Selling Products
              </h5>

              <table className="table">

                <thead>

                  <tr>
                    <th>Product</th>
                    <th>Sold</th>
                  </tr>

                </thead>

                <tbody>

                  {topSelling.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.sold || 0}</td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* Recent Products */}

          <div className="card shadow border-0">

            <div className="card-body">

              <h5 className="mb-3">
                Recent Products
              </h5>

              <table className="table table-hover">

                <thead className="table-dark">

                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Sold</th>
                  </tr>

                </thead>

                <tbody>

                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>KES {p.price}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: getStockColor(
                              p.stock
                            ),
                          }}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td>{p.sold || 0}</td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        </>
      )}
    </>
  );
}