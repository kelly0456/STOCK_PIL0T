import { useEffect, useState } from "react";
import axios from "axios";

export default function Sales() {
  const API_URL = import.meta.env.VITE_API_URL;

  // Product & Search state
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Cart state
  const [cart, setCart] = useState([]);

  // Checkout state
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [discount, setDiscount] = useState(0);
  const [amountReceived, setAmountReceived] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankReference, setBankReference] = useState("");

  // POS Analytics State
  const [completedTransactions, setCompletedTransactions] = useState(0);
  const [totalSalesRevenue, setTotalSalesRevenue] = useState(0);
  const [totalItemsSold, setTotalItemsSold] = useState(0);

  // =====================================================
  // CALCULATED VALUES
  // =====================================================

  const totalCartItems = cart.reduce((total, item) => total + item.qty, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const parsedDiscount = Math.max(0, Number(discount) || 0);
  const total = Math.max(0, subtotal - parsedDiscount);

  const parsedAmountReceived = Number(amountReceived) || 0;
  const change = parsedAmountReceived - total;

  // Currency Formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products by search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // =====================================================
  // CART ACTIONS
  // =====================================================

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item._id === product._id);

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                qty: item.qty < product.stock ? item.qty + 1 : item.qty,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          qty: 1,
        },
      ]);
    }
  };

  const increaseQty = (_id) => {
    setCart(
      cart.map((item) => {
        if (item._id === _id && item.qty < item.stock) {
          return { ...item, qty: item.qty + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQty = (_id) => {
    setCart(
      cart
        .map((item) => {
          if (item._id === _id) {
            return { ...item, qty: item.qty - 1 };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (_id) => {
    setCart(cart.filter((item) => item._id !== _id));
  };

  // Helper to clear checkout form state
  const resetFormState = () => {
    setCart([]);
    setPaymentMethod("Cash");
    setDiscount(0);
    setAmountReceived("");
    setPhoneNumber("");
    setBankName("");
    setBankReference("");
  };

  // =====================================================
  // COMPLETE SALE
  // =====================================================

  const completeSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    // Payment validation checks
    if (paymentMethod === "Cash" && parsedAmountReceived < total) {
      alert("Amount received is less than the total balance.");
      return;
    }

    if (paymentMethod === "M-Pesa" && !phoneNumber.trim()) {
      alert("Please provide an M-Pesa phone number.");
      return;
    }

    if (paymentMethod === "Bank" && (!bankName.trim() || !bankReference.trim())) {
      alert("Please enter both the bank name and transaction reference.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/api/sales`,
        {
          items: cart.map((item) => ({
            productId: item._id,
            quantity: item.qty,
          })),
          paymentMethod,
          phone: phoneNumber,
          bankName,
          bankReference,
          amountReceived: parsedAmountReceived,
          discount: parsedDiscount,
          totalAmount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCompletedTransactions((prev) => prev + 1);
        setTotalSalesRevenue((prev) => prev + total);
        setTotalItemsSold((prev) => prev + totalCartItems);

        resetFormState();
        await fetchProducts();

        alert(response.data.message || "Sale Completed Successfully!");
      }
    } catch (error) {
      console.error("Sale Error:", error);
      alert(
        error.response?.data?.message || "Failed to complete sale."
      );
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Sales Point Of Sale (POS)</h2>
        <p className="text-muted">
          Process customer purchases quickly and efficiently.
        </p>
      </div>

      {/* Dashboard Metrics */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body">
              <small className="text-muted">Today's Sales</small>
              <h3 className="fw-bold text-success mt-2">
                {formatCurrency(totalSalesRevenue)}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body">
              <small className="text-muted">Transactions</small>
              <h3 className="fw-bold text-primary mt-2">
                {completedTransactions}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body">
              <small className="text-muted">Items Sold</small>
              <h3 className="fw-bold text-warning mt-2">{totalItemsSold}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body">
              <small className="text-muted">Cart Items</small>
              <h3 className="fw-bold text-danger mt-2">{totalCartItems}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Products Catalog & Shopping Cart */}
      <div className="row">
        {/* Products Section */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow border-0 rounded-4 h-100">
            <div className="card-body">
              <h4 className="fw-bold mb-4">Products</h4>

              <input
                type="text"
                className="form-control mb-4"
                placeholder="Search Products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-5">
                  <h4>No Products Available</h4>
                  <p className="text-muted">
                    Add products from the Products page first.
                  </p>
                </div>
              ) : (
                <div className="row">
                  {filteredProducts.map((product) => (
                    <div
                      className="col-md-6 col-xl-4 mb-4"
                      key={product._id}
                    >
                      <div className="card h-100 shadow-sm">
                        <div className="card-body d-flex flex-column justify-content-between">
                          <div>
                            <h5 className="fw-bold">{product.name}</h5>
                            <p className="text-muted mb-2">
                              {product.category}
                            </p>
                            <h4 className="text-success fw-bold">
                              {formatCurrency(product.price)}
                            </h4>
                            <p className="mb-3">
                              Stock: <strong>{product.stock}</strong>
                            </p>
                          </div>

                          <button
                            className="btn btn-success w-100"
                            disabled={product.stock <= 0}
                            onClick={() => addToCart(product)}
                          >
                            {product.stock <= 0 ? "Out of Stock" : "Add To Cart"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow border-0 rounded-4 h-100">
            <div className="card-body d-flex flex-column">
              <h4 className="fw-bold mb-3">Shopping Cart</h4>
              <hr />

              {cart.length === 0 ? (
                <p className="text-muted text-center my-auto">
                  Cart is empty.
                </p>
              ) : (
                <div className="flex-grow-1 overflow-auto pe-1">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="border rounded-3 p-3 mb-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="fw-bold mb-1">{item.name}</h6>
                          <small className="text-muted">
                            {formatCurrency(item.price)}
                          </small>
                        </div>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeItem(item._id)}
                        >
                          ×
                        </button>
                      </div>

                      <div className="d-flex align-items-center justify-content-between mt-3">
                        <div>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => decreaseQty(item._id)}
                          >
                            -
                          </button>
                          <span className="mx-3 fw-bold">{item.qty}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => increaseQty(item._id)}
                          >
                            +
                          </button>
                        </div>

                        <strong>
                          {formatCurrency(item.qty * item.price)}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <hr />
              <div className="d-flex justify-content-between">
                <h5>Subtotal</h5>
                <h5 className="text-success">{formatCurrency(subtotal)}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Section */}
      <div className="row">
        <div className="col-lg-12">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body">
              <h4 className="fw-bold mb-4">Checkout</h4>

              <div className="row">
                {/* Payment Method */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">
                    Payment Method
                  </label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="Bank">Bank Transfer</option>
                  </select>
                </div>

                {/* M-Pesa Inputs */}
                {paymentMethod === "M-Pesa" && (
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">
                      M-Pesa Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="254712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                )}

                {/* Bank Details Inputs */}
                {paymentMethod === "Bank" && (
                  <>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Equity, KCB, Co-op..."
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">
                        Transaction Reference
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Reference Number"
                        value={bankReference}
                        onChange={(e) => setBankReference(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Discount */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Discount</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>

                {/* Amount Received (Cash Only) */}
                {paymentMethod === "Cash" && (
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">
                      Amount Received
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                    />
                  </div>
                )}

                {/* Total */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Total</label>
                  <input
                    type="text"
                    className="form-control fw-bold"
                    value={formatCurrency(total)}
                    readOnly
                  />
                </div>
              </div>

              <hr />

              {/* Checkout Footer */}
              <div className="d-flex justify-content-between align-items-center">
                {paymentMethod === "Cash" ? (
                  <div>
                    <h6 className="text-muted mb-0">Change</h6>
                    <h3
                      className={`fw-bold ${
                        change >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {formatCurrency(change)}
                    </h3>
                  </div>
                ) : (
                  <div />
                )}

                <button
                  className="btn btn-success btn-lg px-4"
                  disabled={cart.length === 0}
                  onClick={completeSale}
                >
                  Complete Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}