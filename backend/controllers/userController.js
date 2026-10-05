const pool = require("../config/db");

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

module.exports = {
    getAdmins,
};