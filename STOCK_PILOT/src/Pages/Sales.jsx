import { useEffect, useState } from "react";
import axios from "axios";

export default function Sales() {

  // =====================================================
  // API URL
  // Reads the backend URL from the Vite environment file
  // Example:
  // VITE_API_URL=https://stock-pil0t-1.onrender.com
  // =====================================================
  const API_URL = import.meta.env.VITE_API_URL;

  // =====================================================
  // PRODUCTS SECTION
  // =====================================================

  // Stores all products retrieved from the database
  const [products, setProducts] = useState([]);

  // Stores the search keyword entered by the cashier
  const [search, setSearch] = useState("");

  // Controls the loading spinner while products load
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [soldProducts, setSoldProducts] = useState([]);

  // =====================================================
  // SHOPPING CART
  // =====================================================

  // Stores all products added to the cart
  const [cart, setCart] = useState([]);

  // =====================================================
  // CHECKOUT INFORMATION
  // =====================================================

  // Selected payment method
  // Cash | M-Pesa | Bank
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Customer phone number (used for M-Pesa)
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phonePrompt, setPhonePrompt] = useState("");
  const [phonePromptType, setPhonePromptType] = useState("text-muted");

  // Discount applied to the sale
  const [discount, setDiscount] = useState(0);

  // Cash received from customer
  const [amountReceived, setAmountReceived] = useState("");

  // Bank Transfer Details
  const [bankName, setBankName] = useState("");
  const [bankReference, setBankReference] = useState("");

  // =====================================================
  // POS DASHBOARD STATISTICS
  // =====================================================

  // Number of completed sales
  const [completedTransactions, setCompletedTransactions] = useState(0);

  // =====================================================
  // PROMPT / NOTIFICATION SYSTEM
  // (We will use this instead of alert() later)
  // =====================================================

  const [prompt, setPrompt] = useState({
    show: false,
    type: "",      // success | error | warning | info
    title: "",
    message: "",
  });

  // =====================================================
  // SALE PROCESSING
  // Used to disable the Complete Sale button
  // while the sale is being processed.
  // =====================================================

  const [processingSale, setProcessingSale] = useState(false);

  // =====================================================
  // CALCULATED VALUES
  // =====================================================

  // Total number of items currently in the cart
  const totalCartItems = cart.reduce(
    (total, item) => total + item.qty,
    0
  );

  // Cart subtotal before discount
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  // Ensure discount is never negative
  const parsedDiscount = Math.max(
    0,
    Number(discount) || 0
  );

  // Final amount after discount
  const total = Math.max(
    0,
    subtotal - parsedDiscount
  );

  // Cash received
  const parsedAmountReceived =
    Number(amountReceived) || 0;

  // Customer change
  const change =
    parsedAmountReceived - total;

  // =====================================================
  // FORMAT CURRENCY
  // Converts numbers into Kenyan Shillings
  // =====================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const isSameDay = (dateA, dateB) =>
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate();

  const today = new Date();
  const todaySales = sales.filter((sale) =>
    isSameDay(new Date(sale.createdAt), today)
  );

  const todayRevenue = todaySales.reduce(
    (sum, sale) => sum + (sale.total || 0),
    0
  );

  const todayTransactions = todaySales.length;

  const todayItemsSold = todaySales.reduce(
    (sum, sale) =>
      sum +
      sale.items.reduce(
        (count, item) => count + Number(item.quantity || 0),
        0
      ),
    0
  );

  const pendingSales = sales.filter(
    (sale) => sale.paymentStatus === "pending"
  );

  const pendingPaymentsCount = pendingSales.length;
  const pendingPaymentsAmount = pendingSales.reduce(
    (sum, sale) => sum + (sale.total || 0),
    0
  );

  // =====================================================
  // FETCH PRODUCTS FROM BACKEND
  // =====================================================

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setSalesLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/sales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSales(response.data.sales || []);
      }
    } catch (error) {
      console.error("Failed to fetch sales", error);
    } finally {
      setSalesLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const productsData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.products)
        ? response.data.products
        : [];

      setProducts(productsData);
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
  // ADD PRODUCT TO CART
  // =====================================================

  const addToCart = (product) => {

    // Check if the product already exists in the cart
    const existingProduct = cart.find(
      (item) => item._id === product._id
    );

    // If product is already in the cart
    if (existingProduct) {

      setCart(
        cart.map((item) => {

          // Increase quantity only if stock is available
          if (item._id === product._id) {

            if (item.qty < product.stock) {
              return {
                ...item,
                qty: item.qty + 1,
              };
            }

            // Stock limit reached
            alert("Maximum available stock reached.");

            return item;
          }

          return item;
        })
      );

    } else {

      // Add new product to cart
      setCart([
        ...cart,
        {
          ...product,
          qty: 1,
        },
      ]);

    }
  };

  // =====================================================
  // INCREASE PRODUCT QUANTITY
  // =====================================================

  const increaseQty = (_id) => {

    setCart(
      cart.map((item) => {

        if (item._id === _id) {

          // Prevent selling more than available stock
          if (item.qty >= item.stock) {

            alert("No more stock available.");

            return item;
          }

          return {
            ...item,
            qty: item.qty + 1,
          };
        }

        return item;

      })
    );

  };

  // =====================================================
  // DECREASE PRODUCT QUANTITY
  // =====================================================

  const decreaseQty = (_id) => {

    setCart(

      cart
        .map((item) => {

          if (item._id === _id) {

            return {
              ...item,
              qty: item.qty - 1,
            };

          }

          return item;

        })

        // Automatically remove item when quantity becomes zero
        .filter((item) => item.qty > 0)

    );

  };

  // =====================================================
  // REMOVE PRODUCT FROM CART
  // =====================================================

  const removeItem = (_id) => {

    // Remove selected item completely
    setCart(
      cart.filter((item) => item._id !== _id)
    );

  };

  // =====================================================
  // RESET CHECKOUT FORM
  // Called after a successful sale
  // =====================================================

  const resetFormState = () => {

    // Empty shopping cart
    setCart([]);

    // Reset payment method
    setPaymentMethod("Cash");

    // Reset discount
    setDiscount(0);

    // Reset cash received
    setAmountReceived("");

    // Reset M-Pesa phone number
    setPhoneNumber("");

    // Reset bank details
    setBankName("");
    setBankReference("");

  };

  // =====================================================
  // COMPLETE SALE
  // Handles:
  // 1. Validation
  // 2. API Request
  // 3. Dashboard Update
  // 4. Reset Form
  // =====================================================

  const completeSale = async () => {

    // Prevent multiple clicks
    if (processingSale) return;

    // ===============================
    // CART VALIDATION
    // ===============================

    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    // ===============================
    // CASH VALIDATION
    // ===============================

    if (
      paymentMethod === "Cash" &&
      parsedAmountReceived < total
    ) {
      alert("Amount received is less than the total amount.");
      return;
    }

    // ===============================
    // MPESA VALIDATION
    // ===============================

    if (
      paymentMethod === "M-Pesa" &&
      !phoneNumber.trim()
    ) {
      alert("Please enter the customer's M-Pesa phone number.");
      return;
    }

    // ===============================
    // BANK VALIDATION
    // ===============================

    if (
      paymentMethod === "Bank" &&
      (
        !bankName.trim() ||
        !bankReference.trim()
      )
    ) {
      alert("Please enter the bank details.");
      return;
    }

    try {

      // Show loading state
      setProcessingSale(true);

      const token = localStorage.getItem("token");
      const invoiceNumber = `INV-${Date.now()}`;

      if (paymentMethod === "M-Pesa") {
        await axios.post(
          `${API_URL}/api/mpesa/stk`,
          {
            phone: phoneNumber,
            amount: total,
            accountReference: invoiceNumber,
            transactionDesc: "StockPilot sale payment",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // ===============================
      // SEND SALE TO SERVER
      // ===============================

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
          invoiceNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ===============================
      // SUCCESS
      // ===============================

      if (response.data.success) {

        const soldItems = cart.map((item) => ({
          ...item,
          subtotal: item.qty * item.price,
        }));

        setSoldProducts(soldItems);

        // Refresh product and sales metrics

        await fetchProducts();
        await fetchSales();

        // Reset Checkout

        resetFormState();

        // Refresh Product Stock

        await fetchProducts();

        setPrompt({
          show: true,
          type: "success",
          title: "Sale Completed",
          message:
            response.data.message ||
            "Sale completed successfully.",
        });

      }

    } catch (error) {

      console.error("Sale Error:", error);

      setPrompt({
        show: true,
        type: "error",
        title: "Sale Failed",
        message:
          error.response?.data?.message ||
          "Unable to complete the sale.",
      });

    } finally {

      // Remove loading state
      setProcessingSale(false);

    }

  };

  return (
    <div className="container-fluid py-4">
      {prompt.show && (
        <div className={`alert alert-${
          prompt.type === "error"
            ? "danger"
            : prompt.type === "success"
            ? "success"
            : prompt.type === "warning"
            ? "warning"
            : "info"
        } alert-dismissible fade show`} role="alert">
          <strong>{prompt.title}</strong> {prompt.message}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setPrompt({ ...prompt, show: false })}
          ></button>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-start border-4 border-primary shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-uppercase text-muted mb-2">
                Today's Revenue
              </h6>
              <h3 className="fw-bold mb-0">
                {formatCurrency(todayRevenue)}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-start border-4 border-success shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-uppercase text-muted mb-2">
                Completed Sales
              </h6>
              <h3 className="fw-bold mb-0">
                {todayTransactions}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-start border-4 border-warning shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-uppercase text-muted mb-2">
                Items Sold
              </h6>
              <h3 className="fw-bold mb-0">
                {todayItemsSold}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-start border-4 border-danger shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-uppercase text-muted mb-2">
                Pending Payments
              </h6>
              <h3 className="fw-bold mb-0">
                {pendingPaymentsCount}
              </h3>
              <small className="text-muted">
                {formatCurrency(pendingPaymentsAmount)}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Products Catalog & Current Sale */}
      <div className="row">

        {/* ================= PRODUCTS SECTION ================= */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow border-0 rounded-4 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Products</h4>
                  <p className="text-muted small mb-0">
                    Search and add items directly to the current sale.
                  </p>
                </div>
                <span className="badge bg-secondary py-2 px-3">
                  {filteredProducts.length} available
                </span>
              </div>

              <div className="input-group mb-4">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success"></div>
                  <p className="mt-3 text-muted">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-box display-3 text-secondary"></i>
                  <h4 className="mt-3">No products found</h4>
                  <p className="text-muted">Try another search or add products first.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product._id}>
                          <td>{product.name}</td>
                          <td>{product.category || "General"}</td>
                          <td>{formatCurrency(product.price)}</td>
                          <td>
                            <span className={`badge ${product.stock > 10 ? "bg-success" : product.stock > 0 ? "bg-warning text-dark" : "bg-danger"}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-primary"
                              disabled={product.stock <= 0}
                              onClick={() => addToCart(product)}
                            >
                              {product.stock <= 0 ? "Out of Stock" : "Add"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card shadow border-0 rounded-4 h-100 d-flex flex-column">
            <div className="card-body d-flex flex-column h-100">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4 className="fw-bold mb-1">Current Sale</h4>
                  <p className="text-muted small mb-0">Review selected items and complete checkout.</p>
                </div>
                <span className="badge bg-primary py-2 px-3">{totalCartItems} item(s)</span>
              </div>

              {cart.length === 0 ? (
                <div className="text-center my-auto">
                  <i className="bi bi-cart-x display-4 text-secondary"></i>
                  <h5 className="mt-3 text-muted">No items selected</h5>
                  <small className="text-secondary">Add products from the list to build the invoice.</small>
                </div>
              ) : (
                <div className="flex-grow-1 overflow-auto mb-3">
                  <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0">
                      <thead>
                        <tr className="text-muted small text-uppercase">
                          <th>Item</th>
                          <th className="text-end">Qty</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => (
                          <tr key={item._id}>
                            <td>
                              <div className="fw-semibold">{item.name}</div>
                              <small className="text-muted">{formatCurrency(item.price)}</small>
                            </td>
                            <td className="text-end">
                              <div className="btn-group btn-group-sm" role="group">
                                <button className="btn btn-outline-secondary" onClick={() => decreaseQty(item._id)}>
                                  <i className="bi bi-dash"></i>
                                </button>
                                <span className="btn btn-light px-3">{item.qty}</span>
                                <button className="btn btn-outline-secondary" onClick={() => increaseQty(item._id)}>
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td className="text-end fw-bold">
                              {formatCurrency(item.qty * item.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="card shadow-sm border rounded-4 p-3 mt-auto">
                <h5 className="fw-bold mb-3">Checkout</h5>
                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option>Cash</option>
                    <option>M-Pesa</option>
                    <option>Bank</option>
                  </select>
                </div>

                {paymentMethod === "Cash" && (
                  <div className="mb-3">
                    <label className="form-label">Amount Received</label>
                    <input type="number" className="form-control" value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)} />
                  </div>
                )}

                {paymentMethod === "M-Pesa" && (
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="2547XXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPhoneNumber(value);
                        if (!value) {
                          setPhonePrompt("Enter the customer's M-Pesa number.");
                          setPhonePromptType("text-muted");
                        } else if (!/^\d{9,12}$/.test(value.replace(/\D/g, ""))) {
                          setPhonePrompt("Number should be 9 to 12 digits.");
                          setPhonePromptType("text-danger");
                        } else {
                          setPhonePrompt("Phone number looks good.");
                          setPhonePromptType("text-success");
                        }
                      }}
                    />
                    {phonePrompt && <div className={`form-text ${phonePromptType}`}>{phonePrompt}</div>}
                  </div>
                )}

                {paymentMethod === "Bank" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Bank Name</label>
                      <input type="text" className="form-control" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Reference</label>
                      <input type="text" className="form-control" value={bankReference} onChange={(e) => setBankReference(e.target.value)} />
                    </div>
                  </>
                )}

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Total</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Change</span>
                  <strong>{formatCurrency(change > 0 ? change : 0)}</strong>
                </div>
                <button className="btn btn-success w-100" disabled={processingSale} onClick={completeSale}>
                  {processingSale ? "Processing..." : "Complete Sale"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}