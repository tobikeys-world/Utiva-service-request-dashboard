const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");


// REGISTER
const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        /*
         * IMPORTANT:
         *
         * Every user registering through the public
         * registration endpoint is ALWAYS an employee.
         *
         * The client cannot choose the role.
         */
        const result = await pool.query(
            `INSERT INTO users
       (name, email, password, role)
       VALUES ($1, $2, $3, 'employee')
       RETURNING id, name, email, role, created_at`,
            [
                name,
                email,
                hashedPassword,
            ]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0],
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Registration failed",
        });
    }
};


// LOGIN
const login = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.json({
            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Login failed",
        });
    }
};


module.exports = {
    register,
    login,
};