import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem("salesHistory")) || []);
  }, []);

  const formatKES = (n) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(n);

  const monthly = {};
  const yearly = {};

  history.forEach((s) => {
    const d = new Date(s.date);
    const mKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
    monthly[mKey] = (monthly[mKey] || 0) + s.total;

    const yKey = d.getFullYear();
    yearly[yKey] = (yearly[yKey] || 0) + s.total;
  });

  return (
    <div className="container py-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <h3 className="mb-4 text-primary fw-bold">📊 Sales History</h3>

      <div className="card shadow p-4 mb-4 bg-white">
        <h5 className="mb-3 fw-semibold">Monthly Sales</h5>
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Month</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(monthly).map((m, i) => (
              <tr key={i}>
                <td>{m}</td>
                <td>{formatKES(monthly[m])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card shadow p-4 bg-white">
        <h5 className="mb-3 fw-semibold">Yearly Profit</h5>
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Year</th>
              <th>Total Profit</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(yearly).map((y, i) => (
              <tr key={i}>
                <td>{y}</td>
                <td>{formatKES(yearly[y])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}