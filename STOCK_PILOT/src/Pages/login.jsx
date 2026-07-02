import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // Save login information
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("fullname", res.data.user.fullname);
      localStorage.setItem(
        "businessName",
        res.data.user.businessName
      );
      localStorage.setItem("email", res.data.user.email);

      setMessage("Login successful!");

      // Redirect based on role
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/sales");
        }
      }, 800);

    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">

      <div
        className="card shadow border-0 mx-auto"
        style={{ maxWidth: "420px" }}
      >

        <div className="card-body p-4">

          <h3 className="text-center text-primary mb-2">
            Welcome Back
          </h3>

          <p className="text-center text-muted mb-4">
            Sign in to continue to StockPilot
          </p>

          {message && (
            <div
              className={`alert ${
                message.includes("successful")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Password
              </label>

              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Signing In...
                </>
              ) : (
                "Login"
              )}
            </button>

          </form>

          <hr />

          <p className="text-center mb-0">
            Don't have a business account?{" "}
            <Link
              to="/register"
              className="text-decoration-none"
            >
              Register
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}