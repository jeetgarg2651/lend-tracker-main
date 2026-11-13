
const express = require("express");
const customerController = require("../controllers/customer.controller");
const { authenticateAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

// All customer routes require admin authentication
router.use(authenticateAdmin);

// Create customer
router.post("/", customerController.createCustomer);

// Get all customers
router.get("/", customerController.getAllCustomers);

// Get customer by ID
router.get("/:id", customerController.getCustomerById);

// Update customer
router.put("/:id", customerController.updateCustomer);

// Activate / Deactivate customer
router.patch("/:id/status", customerController.updateCustomerStatus);

module.exports = router;
