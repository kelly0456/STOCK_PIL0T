import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    loadReports();
    loadSales();
  }, []);

  const loadReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const month = await axios.get(`${API_URL}/api/reports/monthly`, {
        headers,
      });
      const year = await axios.get(`${API_URL}/api/reports/yearly`, {
        headers,
      });

      setMonthly(month.data);
      setYearly(year.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadSales = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${API_URL}/api/sales`, { headers });
      if (response.data.success) {
        setSales(response.data.sales || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isSameDay = (dateA, dateB) =>
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate();

  const selectedSales = sales.filter((sale) =>
    isSameDay(new Date(sale.createdAt), new Date(`${selectedDate}T00:00:00`))
  );

  const totalSelectedRevenue = selectedSales.reduce(
    (sum, sale) => sum + (sale.total || 0),
    0
  );

  const selectedItemsSold = selectedSales.reduce(
    (sum, sale) =>
      sum +
      sale.items.reduce(
        (count, item) => count + Number(item.quantity || 0),
        0
      ),
    0
  );

  const formatKES = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card shadow-sm border-0 rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-3">Select a Date</h5>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="row g-3">
            <div className="col-4">
              <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
                <div className="text-uppercase text-muted small mb-2">Transactions</div>
                <div className="h4 fw-bold mb-0">{selectedSales.length}</div>
              </div>
            </div>
            <div className="col-4">
              <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
                <div className="text-uppercase text-muted small mb-2">Revenue</div>
                <div className="h4 fw-bold mb-0">{formatKES(totalSelectedRevenue)}</div>
              </div>
            </div>
            <div className="col-4">
              <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
                <div className="text-uppercase text-muted small mb-2">Items Sold</div>
                <div className="h4 fw-bold mb-0">{selectedItemsSold}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 rounded-4 mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Daily Sales History</h5>
          {selectedSales.length === 0 ? (
            <div className="text-center py-4 text-muted">No sales found for the selected date.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Total</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSales.map((sale) => (
                    <tr key={sale._id}>
                      <td>{sale.invoiceNumber}</td>
                      <td>{formatKES(sale.total)}</td>
                      <td>
                        {sale.items.reduce(
                          (count, item) => count + Number(item.quantity || 0),
                          0
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          sale.paymentStatus === "paid"
                            ? "bg-success"
                            : sale.paymentStatus === "pending"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}>{sale.paymentStatus}</span>
                      </td>
                      <td>{new Date(sale.createdAt).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow border-0 rounded-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Monthly Income</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Month</th>
                      <th>Sales</th>
                      <th>Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthly.map((m) => (
                      <tr key={`${m._id.year}-${m._id.month}`}>
                        <td>{m._id.year}</td>
                        <td>{m._id.month}</td>
                        <td>{m.totalSales}</td>
                        <td>{formatKES(m.totalIncome)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card shadow border-0 rounded-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Yearly Income</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Sales</th>
                      <th>Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearly.map((y) => (
                      <tr key={y._id.year}>
                        <td>{y._id.year}</td>
                        <td>{y.totalSales}</td>
                        <td>{formatKES(y.totalIncome)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
