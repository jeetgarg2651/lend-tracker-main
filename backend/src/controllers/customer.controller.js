
const customerService = require("../services/customer.service");

// Create customer
async function createCustomer(req, res, next) {
    try {
        const customer = await customerService.createCustomer(req.body);

        return res.status(201).json({
            success: true,
            message: "Customer created successfully",
            customer
        });
    } catch (error) {
        next(error);
    }
}

// Get all customers
async function getAllCustomers(req, res, next) {
    try {
        const customers = await customerService.getAllCustomers();

        return res.status(200).json({
            success: true,
            count: customers.length,
            customers
        });
    } catch (error) {
        next(error);
    }
}

// Get customer by ID
async function getCustomerById(req, res, next) {
    try {
        const customer = await customerService.getCustomerById(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            customer
        });
    } catch (error) {
        next(error);
    }
}

// Update customer
async function updateCustomer(req, res, next) {
    try {
        const customer = await customerService.updateCustomer(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            customer
        });
    } catch (error) {
        next(error);
    }
}

// Activate or deactivate customer
async function updateCustomerStatus(req, res, next) {
    try {
        const customer = await customerService.updateCustomerStatus(
            req.params.id,
            req.body.is_active
        );

        return res.status(200).json({
            success: true,
            message: "Customer status updated successfully",
            customer
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    updateCustomerStatus
};
