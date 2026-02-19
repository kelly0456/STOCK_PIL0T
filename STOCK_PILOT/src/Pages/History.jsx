import { useEffect, useState } from "react";

export default function History() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products")) || []);
  }, []);

  return (
    <>
      <h3 className="mb-3">Sales History</h3>
      <div className="card p-3 shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.sold || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
