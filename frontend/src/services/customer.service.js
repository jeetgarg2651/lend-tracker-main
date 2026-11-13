
const API_URL = "http://localhost:5000/api/customers";

// Common API request handler
async function customerRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            ...(options.body && {
                "Content-Type": "application/json"
            }),
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Customer API request failed");
    }

    return data;
}

// Get all customers
export async function getAllCustomers() {
    return customerRequest("/");
}

// Get customer by ID
export async function getCustomerById(id) {
    return customerRequest(`/${id}`);
}

// Create customer
export async function createCustomer(customerData) {
    return customerRequest("/", {
        method: "POST",
        body: JSON.stringify(customerData)
    });
}

// Update customer
export async function updateCustomer(id, customerData) {
    return customerRequest(`/${id}`, {
        method: "PUT",
        body: JSON.stringify(customerData)
    });
}

// Activate / Deactivate customer
export async function updateCustomerStatus(id, isActive) {
    return customerRequest(`/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
            is_active: isActive
        })
    });
}
