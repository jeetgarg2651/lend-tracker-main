
const { pool } = require("../config/database");

// Create a new customer
async function createCustomer(customer) {
    const [result] = await pool.execute(
        `INSERT INTO customers
         (full_name, phone, email, address, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [
            customer.full_name,
            customer.phone,
            customer.email || null,
            customer.address || null,
            customer.notes || null
        ]
    );

    return result.insertId;
}

// Get all customers
async function findAll() {
    const [rows] = await pool.execute(
        `SELECT * FROM customers
         ORDER BY created_at DESC`
    );

    return rows;
}

// Find customer by ID
async function findById(id) {
    const [rows] = await pool.execute(
        `SELECT * FROM customers
         WHERE id = ?
         LIMIT 1`,
        [id]
    );

    return rows[0] || null;
}


// Find customer by phone number
async function findByPhone(phone) {
    const [rows] = await pool.execute(
        `SELECT * FROM customers
         WHERE phone = ?
         LIMIT 1`,
        [phone]
    );

    return rows[0] || null;
}


// Update customer details
async function updateCustomer(id, customer) {
    const [result] = await pool.execute(
        `UPDATE customers
         SET full_name = ?,
             phone = ?,
             email = ?,
             address = ?,
             notes = ?,
             updated_at = NOW()
         WHERE id = ?`,
        [
            customer.full_name,
            customer.phone,
            customer.email || null,
            customer.address || null,
            customer.notes || null,
            id
        ]
    );

    return result.affectedRows;
}

// Activate or deactivate customer
async function updateStatus(id, isActive) {
    const [result] = await pool.execute(
        `UPDATE customers
         SET is_active = ?,
             updated_at = NOW()
         WHERE id = ?`,
        [isActive, id]
    );

    return result.affectedRows;
}

module.exports = {
    createCustomer,
    findAll,
    findById,
    findByPhone,
    updateCustomer,
    updateStatus
};
