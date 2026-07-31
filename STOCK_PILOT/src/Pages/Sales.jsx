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

  // Total revenue earned
  const [totalSalesRevenue, setTotalSalesRevenue] = useState(0);

  // Total quantity of products sold
  const [totalItemsSold, setTotalItemsSold] = useState(0);

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

  const [soldProducts, setSoldProducts] = useState([]);

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

  // =====================================================
  // FETCH PRODUCTS FROM BACKEND
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

        // Update Dashboard Cards

        setCompletedTransactions(
          (prev) => prev + 1
        );

        setTotalSalesRevenue(
          (prev) => prev + total
        );

        setTotalItemsSold(
          (prev) => prev + totalCartItems
        );

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
      {/* Products Catalog & Shopping Cart */}
      <div className="row">

        {/* ================= PRODUCTS SECTION ================= */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow border-0 rounded-4 h-100">
            <div className="card-body">

              <h4 className="fw-bold mb-4">Products</h4>

              {/* Search */}
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

              {/* Loading */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success"></div>
                  <p className="mt-3 text-muted">
                    Loading products...
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (

                <div className="text-center py-5">
                  <i className="bi bi-box display-3 text-secondary"></i>

                  <h4 className="mt-3">
                    No Products Found
                  </h4>

                  <p className="text-muted">
                    Try another search or add products first.
                  </p>
                </div>

              ) : (

                <div className="row">

                  {filteredProducts.map((product) => (

                    <div
                      className="col-md-6 col-xl-4 mb-4"
                      key={product._id}
                    >
                      <div className="card h-100 shadow-sm border-0">

                       <img
  src={
    product.image ||
    "https://placehold.co/400x250?text=No+Image"
  }
  alt={product.name}
  className="card-img-top"
  style={{
    height: 200,
    objectFit: "cover",
  }}
  onError={(e) => {
    e.target.src = "https://placehold.co/400x250?text=No+Image";
  }}
/>

                        <div className="card-body d-flex flex-column justify-content-between">

                          <div>

                            <h5 className="fw-bold mb-1">
                              {product.name}
                            </h5>

                            <p className="text-muted mb-2">
                              {product.category}
                            </p>

                            <h4 className="text-success fw-bold mb-3">
                              {formatCurrency(product.price)}
                            </h4>

                            <p className="mb-3">
                              Stock
                              <span
                                className={`badge ms-2 ${
                                  product.stock > 10
                                    ? "bg-success"
                                    : product.stock > 0
                                    ? "bg-warning text-dark"
                                    : "bg-danger"
                                }`}
                              >
                                {product.stock}
                              </span>
                            </p>

                          </div>

                          <button
                            className="btn btn-success fw-semibold w-100"
                            disabled={product.stock <= 0}
                            onClick={() => addToCart(product)}
                          >
                            {product.stock <= 0
                              ? "Out of Stock"
                              : "Add to Cart"}
                          </button>

                        </div>

                      </div>
                    </div>

                  ))}

                </div>

              )}
              <h4 className="fw-bold mb-3">
                Shopping Cart
              </h4>

              <hr />

              {cart.length === 0 ? (

                <div className="text-center my-auto">

                  <i className="bi bi-cart-x display-4 text-secondary"></i>

                  <h5 className="mt-3 text-muted">
                    Cart is Empty
                  </h5>

                  <small className="text-secondary">
                    Add products to begin a sale.
                  </small>

                </div>

              ) : (

                <div className="flex-grow-1 overflow-auto pe-1">

                  {cart.map((item) => (

                    <div
                      key={item._id}
                      className="border rounded-3 p-3 mb-3"
                    >

                      <div className="d-flex justify-content-between">

                        <div>

                          <h6 className="fw-bold mb-1">
                            {item.name}
                          </h6>

                          <small className="text-muted">
                            {formatCurrency(item.price)}
                          </small>

                        </div>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeItem(item._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-3">

                        <div>

                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => decreaseQty(item._id)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>

                          <span className="mx-3 fw-bold">
                            {item.qty}
                          </span>

                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => increaseQty(item._id)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>

                        </div>

                        <strong className="text-success">
                          {formatCurrency(item.qty * item.price)}
                        </strong>

                      </div>

                    </div>

                  ))}

                </div>

              )}

              <hr />

            {/* ================= CHECKOUT ================= */}

<div className="card shadow border-0 rounded-4 mt-4">
  <div className="card-body">

    <h4 className="fw-bold mb-4">
      Checkout
    </h4>

    <div className="row">

      <div className="col-md-4 mb-3">
        <label className="form-label">
          Payment Method
        </label>

        <select
          className="form-select"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option>Cash</option>
          <option>M-Pesa</option>
          <option>Bank</option>
        </select>
      </div>

      {paymentMethod === "Cash" && (
        <div className="col-md-4 mb-3">
          <label className="form-label">
            Amount Received
          </label>

          <input
            type="number"
            className="form-control"
            value={amountReceived}
            onChange={(e) => setAmountReceived(e.target.value)}
          />
        </div>
      )}

      {paymentMethod === "M-Pesa" && (
        <div className="col-md-4 mb-3">
          <label className="form-label">
            Phone Number
          </label>

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

          {phonePrompt && (
            <div className={`form-text ${phonePromptType}`}>
              {phonePrompt}
            </div>
          )}
        </div>
      )}

      {paymentMethod === "Bank" && (
        <>
          <div className="col-md-4 mb-3">
            <label className="form-label">
              Bank Name
            </label>

            <input
              type="text"
              className="form-control"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">
              Reference
            </label>

            <input
              type="text"
              className="form-control"
              value={bankReference}
              onChange={(e) => setBankReference(e.target.value)}
            />
          </div>
        </>
      )}

    </div>

    <hr />

    <div className="row align-items-center">

      <div className="col-md-4">
        <h5>
          Total:
          <span className="text-success ms-2">
            {formatCurrency(total)}
          </span>
        </h5>
      </div>

      <div className="col-md-4">
        <h5>
          Change:
          <span className="text-primary ms-2">
            {formatCurrency(change > 0 ? change : 0)}
          </span>
        </h5>
      </div>

      <div className="col-md-4 text-end">

        <button
          className="btn btn-success btn-lg"
          disabled={processingSale}
          onClick={completeSale}
        >
          {processingSale
            ? "Processing..."
            : "Complete Sale"}
        </button>

      </div>

    </div>

  </div>
</div>

            </div>

          </div>

        </div>

      </div>

      {soldProducts.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body">
                <h4 className="fw-bold mb-3">
                  Recently Sold Products
                </h4>

                {soldProducts.map((product) => (
                  <div
                    key={product._id}
                    className="d-flex align-items-center mb-3"
                  >
                    <img
                      src={
                        product.imageUrl ||
                        "https://placehold.co/100x100?text=No+Image"
                      }
                      alt={product.name}
                      width={100}
                      height={100}
                      className="rounded"
                      style={{ objectFit: "cover" }}
                    />

                    <div className="ms-3 flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <strong>{product.name}</strong>
                        <span>{product.qty} pcs</span>
                      </div>
                      <div className="d-flex justify-content-between text-muted small">
                        <span>{formatCurrency(product.price)}</span>
                        <span>{formatCurrency(product.subtotal)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}