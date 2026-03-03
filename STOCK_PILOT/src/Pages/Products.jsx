import { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(""); 
  const [stock, setStock] = useState(""); 
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products")) || []);
  }, []);

  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const addOrUpdateProduct = () => {
    if (!name || price === "" || stock === "") return;
    const newProduct = {
      name,
      price: Number(price),
      stock: Number(stock),
      sold: editIndex !== null ? products[editIndex].sold : 0
    };

    if (editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = newProduct;
      saveProducts(updated);
      setEditIndex(null);
    } else {
      saveProducts([...products, newProduct]);
    }

    setName("");
    setPrice("");
    setStock("");
  };

  const editProduct = (index) => {
    const p = products[index];
    setName(p.name);
    setPrice(p.price);
    setStock(p.stock);
    setEditIndex(index);
  };

  const deleteProduct = (index) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updated = [...products];
      updated.splice(index, 1);
      saveProducts(updated);
    }
  };

  const stockColor = (stock) => {
    if (stock === 0) return "bg-danger text-white";
    if (stock <= 15) return "bg-maroon text-white";
    if (stock <= 30) return "bg-warning text-dark";
    return "bg-success text-white";
  };

  const formatKES = (n) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(n);

  return (
    <div className="container py-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <h3 className="mb-4 text-primary fw-bold">📦 Products</h3>

      {/* Add/Edit Product Form */}
      <div className="card shadow p-4 mb-4 bg-white">
        <h5 className="fw-semibold mb-3">{editIndex !== null ? "Edit Product" : "Add New Product"}</h5>
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Stock</label>
            <input
              type="number"
              className="form-control"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter stock quantity"
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-warning w-100" onClick={addOrUpdateProduct}>
              {editIndex !== null ? "Update" : "Add Product"}
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card shadow p-4 bg-white">
        <h5 className="fw-semibold mb-3">Product List</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Stock</th>
                <th>Sold</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p, i) => (
                  <tr key={i}>
                    <td>{p.name}</td>
                    <td>
                      <span className={`px-2 py-1 rounded ${stockColor(p.stock)}`}>{p.stock}</span>
                    </td>
                    <td>{p.sold || 0}</td>
                    <td>{formatKES(p.price)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editProduct(i)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(i)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-secondary">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}