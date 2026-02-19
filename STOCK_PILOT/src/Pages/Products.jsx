import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ADD OR UPDATE PRODUCT */
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) return;

    const newProduct = {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      sold: 0
    };

    if (editingIndex !== null) {
      const updated = [...products];
      updated[editingIndex] = {
        ...updated[editingIndex],
        ...newProduct
      };
      setProducts(updated);
      setEditingIndex(null);
    } else {
      setProducts([...products, newProduct]);
    }

    setForm({ name: "", price: "", stock: "" });
  };

  /* EDIT BUTTON */
  const editProduct = (index) => {
    const p = products[index];
    setForm({
      name: p.name,
      price: p.price,
      stock: p.stock
    });
    setEditingIndex(index);
  };

  /* DELETE */
  const deleteProduct = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  const formatKES = amount =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES"
    }).format(amount);

  return (
    <div style={{ background: "#eef2f7", minHeight: "100vh" }}>

      {/* Header */}
      <div
        className="px-4 py-3 mb-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg,#0dcaf0,#20c997)",
          color: "white"
        }}
      >
        <h3 className="fw-bold m-0">
          {editingIndex !== null ? "Edit Product" : "Add Products"}
        </h3>
        <small className="opacity-75">
          Manage your inventory items
        </small>
      </div>

      <div className="container-fluid px-4">

        {/* FORM */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body">

            <h5 className="fw-semibold mb-3">
              {editingIndex !== null ? "Update Product" : "New Product"}
            </h5>

            <form className="row g-3" onSubmit={handleSubmit}>

              <div className="col-md-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="form-control"
                />
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price (KES)"
                  className="form-control"
                />
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Quantity"
                  className="form-control"
                />
              </div>

              <div className="col-md-2 d-grid">
                <button className={`btn fw-semibold ${editingIndex !== null ? "btn-warning" : "btn-info text-white"}`}>
                  {editingIndex !== null ? "Update" : "Save"}
                </button>
              </div>

            </form>
          </div>
        </div>


        {/* PRODUCT TABLE */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">

            <div className="d-flex justify-content-between mb-3">
              <h5 className="fw-semibold m-0">Stored Products</h5>
              <span className="badge bg-info-subtle text-info px-3 py-2 rounded-pill">
                {products.length} items
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">

                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {products.length > 0 ? (
                    products.map((p, i) => (
                      <tr key={i}>
                        <td className="fw-medium">{p.name}</td>
                        <td>{formatKES(p.price)}</td>
                        <td>{p.stock}</td>

                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => editProduct(i)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteProduct(i)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-secondary">
                        No products added yet
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
