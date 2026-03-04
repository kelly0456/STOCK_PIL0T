import { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(saved);
  }, []);

  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const addProduct = () => {
    if (!name || !price || !stock) return;

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price),
      stock: Number(stock),
      sold: 0
    };

    const updated = [...products, newProduct];
    saveProducts(updated);

    setName("");
    setPrice("");
    setStock("");
  };

  const deleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    saveProducts(updated);
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "danger";      // Red
    if (stock >= 1 && stock <= 15) return "purple";
    if (stock >= 16 && stock <= 30) return "warning"; // Yellow
    return "success";                     // Green
  };

  const getBadgeStyle = (stock) => {
    if (stock >= 1 && stock <= 15)
      return { backgroundColor: "#6f42c1", color: "white" }; // Purple custom
    return {};
  };

  return (
    <>
      <h3 className="mb-3">Products</h3>

      <div className="card p-4 shadow mb-4 col-md-6">
        <input
          className="form-control mb-2"
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Stock"
          value={stock}
          onChange={e => setStock(e.target.value)}
        />
        <button onClick={addProduct} className="btn btn-primary w-100">
          Add Product
        </button>
      </div>

      <table className="table table-bordered shadow">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Sold</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>KES {p.price}</td>
              <td>
                <span
                  className={`badge bg-${getStockColor(p.stock)}`}
                  style={getBadgeStyle(p.stock)}
                >
                  {p.stock}
                </span>
              </td>
              <td>{p.sold || 0}</td>
              <td>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}