import "./CustomerForm.css";
import { useState } from "react";
import { createCustomer, updateCustomer } from "../../services/customer.service";

function CustomerForm({ customer, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        full_name: customer?.full_name || "",
        phone: customer?.phone || "",
        email: customer?.email || "",
        address: customer?.address || "",
        notes: customer?.notes || ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (customer) {
                await updateCustomer(customer.id, formData);
            } else {
                await createCustomer(formData);
            }

            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="customer-form" onSubmit={handleSubmit}>
            {error && <p className="customer-form-error">{error}</p>}

            <label>Full Name *</label>
            <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
                maxLength={150}
            />

            <label>Phone Number *</label>
            <input
    type="tel"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    placeholder="Enter 10 digit mobile number"
    required
    maxLength={10}
    pattern="[6-9][0-9]{9}"
    title="Enter a valid 10 digit Indian mobile number"
/>

            <label>Email Address</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
            />

            <label>Address</label>
            <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows={3}
            />

            <label>Notes</label>
            <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes"
                rows={3}
            />

            <div className="customer-form-actions">
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>

                <button type="submit" disabled={loading}>
                    {loading
                        ? "Saving..."
                        : customer
                            ? "Update Customer"
                            : "Save Customer"}
                </button>
            </div>
        </form>
    );
}

export default CustomerForm;
