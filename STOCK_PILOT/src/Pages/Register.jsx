import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      return setMessage(
        "Passwords do not match."
      );

    }

    try {

      setLoading(true);

  await axios.post(
  "http://localhost:5000/api/auth/register",
        {
          businessName:
            formData.businessName,
          fullname:
            formData.fullname,
          email:
            formData.email,
          password:
            formData.password,
        }
      );

      setMessage(res.data.message);

      setTimeout(() => {

        navigate("/login");

      }, 1500);

    } catch (err) {

      setMessage(
        err.response?.data?.message ||
        "Registration failed."
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="container py-5">

      <div
        className="card shadow border-0 mx-auto"
        style={{ maxWidth: "500px" }}
      >

        <div className="card-body p-4">

          <h3 className="text-center text-primary mb-4">
            Create Business Account
          </h3>

          {message && (
            <div className="alert alert-info">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >

            <div className="mb-3">

              <label className="form-label">
                Business Name
              </label>

              <input
                type="text"
                className="form-control"
                name="businessName"
                placeholder="KellyTech Solutions"
                value={
                  formData.businessName
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="mb-3">

              <label className="form-label">
                Full Name
              </label>

              <input
                type="text"
                className="form-control"
                name="fullname"
                value={
                  formData.fullname
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="mb-3">

              <label className="form-label">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="mb-3">

              <label className="form-label">
                Password
              </label>

              <input
                type="password"
                className="form-control"
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="mb-4">

              <label className="form-label">
                Confirm Password
              </label>

              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <button
              className="btn btn-primary w-100"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}