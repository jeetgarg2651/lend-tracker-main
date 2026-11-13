import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomerForm from "../component/customer/CustomerForm";
import {
  getAllCustomers,
  updateCustomerStatus,
} from "../services/customer.service";

import "./Customers.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const data = await getAllCustomers();
      setCustomers(data.customers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function handleStatusChange(customer) {
    try {
      await updateCustomerStatus(customer.id, !Boolean(customer.is_active));

      await loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase().trim();

    return (
        customer.full_name.toLowerCase().includes(search) ||
        customer.phone.includes(search)
    );
});

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <span className="dashboard-logo-icon">L</span>
          LendTrack
        </div>

        <nav className="dashboard-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link className="active" to="/customers">
            Customers
          </Link>
          <a href="/loans">Loans</a>
          <a href="/repayments">Repayments</a>
          <a href="/transactions">Transactions</a>
          <a href="/reports">Reports</a>
          <a href="/settings">Settings</a>
        </nav>

        <div className="sidebar-footer">Personal Lending System</div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Customers</h1>
            <p>Manage your registered customers.</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <span>Administrator</span>
          </div>
        </header>

        <section className="customer-section">
          <div className="customer-section-heading">
            <div>
              <h2>All Customers</h2>
              <p>{filteredCustomers.length} customers found</p>
            </div>

            <input
    type="text"
    className="customer-search"
    placeholder="Search by name or phone..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
/>

            <button
              type="button"
              onClick={() => {
                setEditingCustomer(null);
                setShowForm(true);
              }}
            >
              + Add Customer
            </button>
          </div>

          {loading && <p>Loading customers...</p>}

          {error && (
            <div className="customer-error">
              {error}
              <button onClick={loadCustomers}>Retry</button>
            </div>
          )}

          {!loading && !error && customers.length === 0 && (
            <div className="customer-empty">
              <h3>No customers found</h3>
              <p>Add your first customer to get started.</p>
            </div>
          )}

          {!loading && customers.length > 0 && (
            <div className="customer-table-wrapper">
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                    {filteredCustomers.length === 0 && (
    <tr>
        <td colSpan="5" style={{ textAlign: "center", padding: "25px" }}>
            No matching customers found.
        </td>
    </tr>
)}
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.full_name}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.email || "—"}</td>

                      <td>
                        <span
                          className={
                            customer.is_active
                              ? "customer-status active"
                              : "customer-status inactive"
                          }
                        >
                          {customer.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                       <div className="customer-action-buttons">
    <button
        className="customer-edit-btn"
        onClick={() => {
            setEditingCustomer(customer);
            setShowForm(true);
        }}
    >
        Edit
    </button>

    <button
        className="customer-action-btn"
        onClick={() => handleStatusChange(customer)}
    >
        {customer.is_active ? "Deactivate" : "Activate"}
    </button>
</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showForm && (
          <div className="customer-modal-overlay">
            <div className="customer-modal">
              <div className="customer-modal-header">
                <h2>
                  {editingCustomer ? "Edit Customer" : "Add New Customer"}
                </h2>

                <button type="button" onClick={() => setShowForm(false)}>
                  ✕
                </button>
              </div>

              <CustomerForm
                customer={editingCustomer}
                onSuccess={() => {
                  setShowForm(false);
                  setEditingCustomer(null);
                  loadCustomers();
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditingCustomer(null);
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Customers;
