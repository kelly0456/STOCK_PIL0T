import { useState, useEffect } from "react";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState(null);
  const [amountPaid, setAmountPaid] = useState("");

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products")) || []);
  }, []);

  const suggestions = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) &&
      p.stock > 0
  );

  const selectProduct = (p) => {
    setSelected(p);
    setQuery(p.name);
    setQty(1);
  };

  const total = selected ? selected.price * qty : 0;
  const change = amountPaid ? Number(amountPaid) - total : 0;

  const recordSale = () => {
    if (!selected || qty < 1 || qty > selected.stock || !amountPaid) return;

    // Update product stock & sold
    const updatedProducts = products.map((p) =>
      p.name === selected.name
        ? { ...p, stock: p.stock - qty, sold: (p.sold || 0) + qty }
        : p
    );
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    // Record sale in salesHistory (per day)
    const salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || [];
    const newSale = {
      name: selected.name,
      qty,
      price: selected.price,
      total: total,
      date: new Date().toISOString(),
    };
    localStorage.setItem("salesHistory", JSON.stringify([...salesHistory, newSale]));

    // Reset form
    setSelected(null);
    setQuery("");
    setQty(1);
    setAmountPaid("");
  };

  return (
    <div className="container py-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <h3 className="mb-4 text-primary fw-bold">💰 Sales</h3>

      <div className="card shadow p-4 col-md-6 mx-auto rounded">
        {/* Product Search */}
        <label className="form-label fw-semibold">Product</label>
        <input
          className="form-control mb-2"
          placeholder="Type product name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Suggestions */}
        {query && suggestions.length > 0 && (
          <ul className="list-group mb-3">
            {suggestions.map((p, i) => (
              <li
                key={i}
                onClick={() => selectProduct(p)}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
              >
                <span>{p.name}</span>
                <span className="badge bg-info">{p.stock} left</span>
              </li>
            ))}
          </ul>
        )}

        {/* Quantity */}
        <label className="form-label fw-semibold">Quantity</label>
        <input
          type="number"
          className="form-control mb-3"
          min="1"
          max={selected ? selected.stock : 1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          disabled={!selected}
        />

        {/* Total & Payment */}
        <h5 className="mb-2">Total: KSh {total.toLocaleString()}</h5>
        <label className="form-label fw-semibold">Amount Paid</label>
        <input
          type="number"
          className="form-control mb-2"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          disabled={!selected}
        />

        {amountPaid && (
          <h5 className="mb-3">
            Change: KSh {change >= 0 ? change.toLocaleString() : "0"}
          </h5>
        )}

        <button
          className="btn btn-primary w-100"
          onClick={recordSale}
          disabled={!selected || qty < 1 || qty > selected.stock || !amountPaid}
        >
          Confirm Sale
        </button>
      </div>
    </div>
  );
}