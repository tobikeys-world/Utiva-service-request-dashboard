const pool = require("../config/db");

const getRequestHistory = async (req, res) => {
    try {
        const { id } = req.params;

        const requestResult = await pool.query(
            `SELECT
        id,
        created_by
       FROM requests
       WHERE id = $1`,
            [id]
        );

        if (requestResult.rows.length === 0) {
            return res.status(404).json({
                message: "Request not found",
            });
        }

        const request = requestResult.rows[0];

        // Employees can only see history for their own requests
        if (
            req.user.role !== "admin" &&
            request.created_by !== req.user.id
        ) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        const result = await pool.query(
            `SELECT
        h.id,
        h.request_id,
        h.old_status,
        h.new_status,
        u.name AS changed_by,
        h.changed_at
       FROM request_status_history h
       JOIN users u
         ON h.changed_by = u.id
       WHERE h.request_id = $1
       ORDER BY h.changed_at ASC`,
            [id]
        );

        res.json({
            request_id: id,
            history: result.rows,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch request history",
        });
    }
};

module.exports = {
    getRequestHistory,
};