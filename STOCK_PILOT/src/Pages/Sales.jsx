import { useState, useEffect } from "react";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products")) || []);
  }, []);

  const suggestions = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const selectProduct = p => {
    setSelected(p);
    setQuery(p.name);
  };

  const total = selected ? selected.price * qty : 0;

  const recordSale = () => {
    if (!selected) return;
    const updated = products.map(p =>
      p.name === selected.name
        ? { ...p, stock: p.stock - qty, sold: (p.sold || 0) + qty }
        : p
    );
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
    setQuery("");
    setSelected(null);
    setQty(1);
  };

  return (
    <>
      <h3 className="mb-3">Sales</h3>
      <div className="card p-4 shadow col-md-6">
        <input
          className="form-control mb-2"
          placeholder="Type product..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {query && (
          <ul className="list-group mb-2">
            {suggestions.map((p, i) => (
              <li key={i} onClick={() => selectProduct(p)} className="list-group-item list-group-item-action">
                {p.name}
              </li>
            ))}
          </ul>
        )}

        <input
          type="number"
          className="form-control mb-2"
          value={qty}
          onChange={e => setQty(Number(e.target.value))}
        />

        <h5>Total: {total}</h5>

        <button onClick={recordSale} className="btn btn-primary w-100">
          Confirm Sale
        </button>
      </div>
    </>
  );
}
