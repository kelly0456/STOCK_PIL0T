import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
const [image, setImage] = useState(null);
const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================
  // Load Products
  // ==========================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/api/products`);

      const productsData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.products)
        ? res.data.products
        : [];

      setProducts(productsData);

    } catch (err) {
      console.error(err);
      setMessage("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================
  // Add Product
  // ==========================
  const addProduct = async () => {

    if (!name || !price || !stock) {
      return setMessage("Please fill in all fields.");
    }

    try {
  const formData = new FormData();

formData.append("name", name);
formData.append("price", Number(price));
formData.append("stock", Number(stock));
formData.append("sold", 0);

if (image) {
  formData.append("image", image);
}

await axios.post(
  `${API_URL}/api/products`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

      setName("");
      setPrice("");
      setStock("");
      setImage(null);
setPreview("");
fetchProducts();
setMessage("Product added successfully.");
    } catch (err) {

      console.error(err);

      setMessage(
        err.response?.data?.message || "Failed to add product."
      );
    }
  };

  // ==========================
  // Delete Product
  // ==========================
  const deleteProduct = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    try {

      await axios.delete(`${API_URL}/api/products/${id}`);

      setMessage("Product deleted successfully.");

      fetchProducts();

    } catch (err) {

      console.error(err);

      setMessage(
        err.response?.data?.message || "Delete failed."
      );
    }
  };

  // ==========================
  // Badge Colors
  // ==========================
  const getStockColor = (stock) => {
    if (stock === 0) return "danger";
    if (stock <= 15) return "secondary";
    if (stock <= 30) return "warning";
    return "success";
  };

  const getBadgeStyle = (stock) => {
    if (stock >= 1 && stock <= 15) {
      return {
        backgroundColor: "#d45dec",
        color: "#fff",
      };
    }

    return {};
  };

  return (
    <>
      <h3 className="mb-3">Products</h3>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <div className="card shadow p-4 mb-4 col-md-6">

        <input
          className="form-control mb-2"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

      <input
  type="file"
  className="form-control mb-3"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }}
/>

{preview && (
  <div className="mb-3">
    <label className="form-label small text-muted">
      Image Preview
    </label>

    <img
      src={preview}
      alt="Preview"
      className="img-fluid rounded"
      style={{
        maxHeight: "220px",
        objectFit: "cover",
      }}
    />
  </div>
)}

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button
          onClick={addProduct}
          className="btn btn-primary"
        >
          Add Product
        </button>

      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border"></div>
        </div>
      ) : (
        <table className="table table-bordered shadow">

          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sold</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {products.length === 0 ? (

              <tr>
                <td colSpan="6" className="text-center">
                  No products found.
                </td>
              </tr>

            ) : (

              products.map((p) => (

                <tr key={p._id}>

              <td>
  <img
    src={
      p.image ||
      "https://placehold.co/60x60?text=No+Image"
    }
    alt={p.name}
    width="60"
    height="60"
    className="rounded"
    style={{ objectFit: "cover" }}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "https://placehold.co/60x60?text=No+Image";
    }}
  />
</td>

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

                  <td>{p.sold}</td>

                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>
      )}
    </>
  );
}