
const customerModel = require("../models/customer.model");

// Custom HTTP error
function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

// Validate customer details
function validateCustomer(customer) {
    if (!customer || typeof customer !== "object") {
        throw createError("Customer details are required", 400);
    }

    if (
        !customer.full_name ||
        typeof customer.full_name !== "string" ||
        !customer.full_name.trim()
    ) {
        throw createError("Customer name is required", 400);
    }

    if (
        !customer.phone ||
        typeof customer.phone !== "string" ||
        !customer.phone.trim()
    ) {
        throw createError("Customer phone number is required", 400);
    }

    if (customer.full_name.trim().length > 150) {
        throw createError("Customer name cannot exceed 150 characters", 400);
    }

   if (!/^[6-9]\d{9}$/.test(customer.phone.trim())) {
    throw createError(
        "Phone number must be exactly 10 digits and start with 6, 7, 8, or 9",
        400
    );
}

    if (
        customer.email &&
        (typeof customer.email !== "string" ||
         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()))
    ) {
        	throw createError("Valid email address is required", 400);
    }
}

// Create customer
async function createCustomer(customer) {
    validateCustomer(customer);

    const normalizedCustomer = {
        full_name: customer.full_name.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim().toLowerCase() : null,
        address: customer.address ? String(customer.address).trim() : null,
        notes: customer.notes ? String(customer.notes).trim() : null
    };

    const existingCustomer = await customerModel.findByPhone(
        normalizedCustomer.phone
    );

    if (existingCustomer) {
        throw createError(
    "Customer with this phone number already exists",
    409
);
    }

    const customerId = await customerModel.createCustomer(normalizedCustomer);

    return customerModel.findById(customerId);
}


// Get all customers
async function getAllCustomers() {
    return customerModel.findAll();
}

// Get customer by ID
async function getCustomerById(id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw new Error("Valid customer ID is required");
    }

    const customer = await customerModel.findById(Number(id));

    if (!customer) {
       throw createError("Customer not found", 404);
    }

    return customer;
}


async function updateCustomer(id, customer) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw createError("Valid customer ID is required", 400);
    }

    validateCustomer(customer);

    const customerId = Number(id);

    const existingCustomer = await customerModel.findById(customerId);

    if (!existingCustomer) {
        throw createError("Customer not found", 404);
    }

    const normalizedCustomer = {
        full_name: customer.full_name.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim().toLowerCase() : null,
        address: customer.address ? String(customer.address).trim() : null,
        notes: customer.notes ? String(customer.notes).trim() : null
    };

    const phoneOwner = await customerModel.findByPhone(
        normalizedCustomer.phone
    );

    if (phoneOwner && Number(phoneOwner.id) !== customerId) {
        throw createError("Another customer already uses this phone number", 409);
    }

    await customerModel.updateCustomer(customerId, normalizedCustomer);

    return customerModel.findById(customerId);
}


async function updateCustomerStatus(id, isActive) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw createError("Valid customer ID is required", 400);
    }

    if (typeof isActive !== "boolean") {
        throw createError("Valid customer status is required", 400);
    }

    const customerId = Number(id);

    const existingCustomer = await customerModel.findById(customerId);

    if (!existingCustomer) {
        throw createError("Customer not found", 404);
    }

    await customerModel.updateStatus(customerId, isActive);

    return customerModel.findById(customerId);
}

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    updateCustomerStatus
};