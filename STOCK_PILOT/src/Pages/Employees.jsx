import { useEffect, useState } from "react";
import axios from "axios";

export default function Employees() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const [employee, setEmployee] = useState({
    fullname: "",
    email: "",
    phone: "",
    position: "",
    password: "",
  });

  // ===============================
  // Load Employees
  // ===============================
  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/employees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployees(res.data);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ===============================
  // Handle Input
  // ===============================
  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // Create Employee
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      await axios.post(
        `${API_URL}/api/employees`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Employee created successfully.");

      setEmployee({
        fullname: "",
        email: "",
        phone: "",
        position: "",
        password: "",
      });

      setShowModal(false);

      fetchEmployees();

    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.message ||
          "Unable to create employee."
      );
    }
  };

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Employees</h2>
          <p className="text-muted">
            Manage your employees.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Add Employee
        </button>
      </div>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">

          <table className="table table-hover">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.fullname}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.position}</td>
                    <td>
                      {emp.active ? (
                        <span className="badge bg-success">
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-danger">
                          Suspended
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      </div>

      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,.45)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <form onSubmit={handleSubmit}>

                <div className="modal-header">
                  <h5>Add Employee</h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">

                  <input
                    className="form-control mb-3"
                    placeholder="Full Name"
                    name="fullname"
                    value={employee.fullname}
                    onChange={handleChange}
                    required
                  />

                  <input
                    className="form-control mb-3"
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={employee.email}
                    onChange={handleChange}
                    required
                  />

                  <input
                    className="form-control mb-3"
                    placeholder="Phone"
                    name="phone"
                    value={employee.phone}
                    onChange={handleChange}
                  />

                  <input
                    className="form-control mb-3"
                    placeholder="Position"
                    name="position"
                    value={employee.position}
                    onChange={handleChange}
                  />

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Temporary Password"
                    name="password"
                    value={employee.password}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Create Employee
                  </button>

                </div>

              </form>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}