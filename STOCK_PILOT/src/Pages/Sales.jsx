import { useState, useEffect } from "react";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
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

  const addToCart = () => {
    if (!selected || qty < 1 || qty > selected.stock) return;

    const item = {
      id: Date.now(),
      name: selected.name,
      price: selected.price,
      qty,
      total: selected.price * qty,
    };

    setCart([...cart, item]);
    setQuery("");
    setSelected(null);
    setQty(1);
  };

  // 🔹 Fast cashier: pressing Enter adds product directly to cart
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (selected) {
        addToCart();
      } else if (suggestions.length > 0) {
        selectProduct(suggestions[0]);
        setTimeout(() => addToCart(), 50); // small delay for state update
      }
    }
  };

  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const change = amountPaid ? Number(amountPaid) - grandTotal : 0;

  const confirmSale = () => {
    if (cart.length === 0 || change < 0) return;

    // Update product stock
    const updatedProducts = products.map((p) => {
      const soldItem = cart.find((c) => c.name === p.name);
      if (soldItem) {
        return {
          ...p,
          stock: p.stock - soldItem.qty,
          sold: (p.sold || 0) + soldItem.qty,
        };
      }
      return p;
    });

    localStorage.setItem("products", JSON.stringify(updatedProducts));

    // Save sale history
    const salesHistory =
      JSON.parse(localStorage.getItem("salesHistory")) || [];
    const newSale = {
      id: Date.now(),
      items: cart,
      total: grandTotal,
      date: new Date().toISOString(),
    };
    localStorage.setItem(
      "salesHistory",
      JSON.stringify([...salesHistory, newSale])
    );

    setProducts(updatedProducts);
    setCart([]);
    setAmountPaid("");
  };

  return (
    <div className="container py-4">
      <h3 className="mb-3 text-primary">Sales POS</h3>

      <div className="card p-4 mb-4">
        <input
          className="form-control mb-2"
          placeholder="Search product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {query && suggestions.length > 0 && (
          <ul className="list-group mb-3">
            {suggestions.map((p) => (
              <li
                key={p.name}
                onClick={() => selectProduct(p)}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                {p.name} (KSh {p.price})
              </li>
            ))}
          </ul>
        )}

        {selected && (
          <>
            <input
              type="number"
              className="form-control mb-2"
              min="1"
              max={selected.stock}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              onKeyDown={handleKeyDown}
            />
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="card p-4">
          <h5>Cart</h5>
          {cart.map((item) => (
            <div key={item.id} className="d-flex justify-content-between">
              <span>{item.name} x{item.qty}</span>
              <span>KSh {item.total}</span>
            </div>
          ))}

          <hr />
          <h5>Total: KSh {grandTotal}</h5>

          <input
            type="number"
            className="form-control mb-2"
            placeholder="Amount Paid"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
          />

          <h6>Change: KSh {change >= 0 ? change : 0}</h6>

          <button
            className="btn btn-success w-100"
            onClick={confirmSale}
            disabled={change < 0}
          >
            Confirm Sale
          </button>
        </div>
      )}
    </div>
  );
}