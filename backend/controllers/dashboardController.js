const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'assigned') AS assigned,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'resolved') AS resolved,
        COUNT(*) FILTER (WHERE status = 'closed') AS closed,
        COUNT(*) FILTER (WHERE priority = 'urgent') AS urgent
      FROM requests
    `);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch dashboard statistics",
        });
    }
};

const getRequestsByCategory = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        c.name AS category,
        COUNT(r.id) AS total
      FROM categories c
      LEFT JOIN requests r
        ON c.id = r.category_id
      GROUP BY c.id, c.name
      ORDER BY total DESC
    `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch category statistics",
        });
    }
};

module.exports = {
    getDashboardStats,
    getRequestsByCategory,
};