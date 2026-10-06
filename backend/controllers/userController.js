const pool = require("../config/db");
const bcrypt = require("bcrypt");

// Get all administrators
const getAdmins = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                name,
                email
             FROM users
             WHERE role = 'admin'
             ORDER BY name ASC`
        );

        res.json({
            users: result.rows,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch administrators",
        });
    }
};


// Get all employees
const getEmployees = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                role,
                created_at
             FROM users
             WHERE role = 'employee'
             ORDER BY name ASC`
        );

        res.json({
            users: result.rows,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch employees",
        });
    }
};


// Get all users
const getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                role,
                created_at
             FROM users
             ORDER BY role ASC, name ASC`
        );

        res.json({
            users: result.rows,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch users",
        });
    }
};


// Create a new user
const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required",
            });
        }


        // Validate role
        if (!["employee", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Invalid user role",
            });
        }


        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
            });
        }


        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();


        // Check whether email already exists
        const existingUser = await pool.query(
            `SELECT id
             FROM users
             WHERE email = $1`,
            [normalizedEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "A user with this email already exists",
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create user
        const result = await pool.query(
            `INSERT INTO users (
                name,
                email,
                password,
                role
             )
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, role, created_at`,
            [
                name.trim(),
                normalizedEmail,
                hashedPassword,
                role,
            ]
        );


        res.status(201).json({
            message: `${role === "admin" ? "Administrator" : "Employee"} created successfully`,
            user: result.rows[0],
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create user",
        });
    }
};


module.exports = {
    getAdmins,
    getEmployees,
    getUsers,
    createUser,
};