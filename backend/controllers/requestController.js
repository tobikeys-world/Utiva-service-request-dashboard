const pool = require("../config/db");

// CREATE REQUEST
const createRequest = async (req, res) => {
    try {
        const {
            title,
            description,
            category_id,
            priority = "medium",
        } = req.body;

        if (!title || !description || !category_id) {
            return res.status(400).json({
                message: "Title, description and category are required",
            });
        }

        const result = await pool.query(
            `INSERT INTO requests
       (title, description, category_id, created_by, priority)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [
                title,
                description,
                category_id,
                req.user.id,
                priority,
            ]
        );

        res.status(201).json({
            message: "Request created successfully",
            request: result.rows[0],
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create request",
        });
    }
};


// GET ALL REQUESTS
const getRequests = async (req, res) => {
    try {
        let query = `
      SELECT
        r.id,
        r.title,
        r.description,

        c.name AS category,

        creator.name AS created_by,

        assignee.id AS assigned_to_id,
        assignee.name AS assigned_to,

        r.priority,
        r.status,
        r.created_at,
        r.updated_at

      FROM requests r

      JOIN categories c
        ON r.category_id = c.id

      JOIN users creator
        ON r.created_by = creator.id

      LEFT JOIN users assignee
        ON r.assigned_to = assignee.id
    `;

        let values = [];

        if (req.user.role !== "admin") {
            query += ` WHERE r.created_by = $1`;
            values.push(req.user.id);
        }

        query += ` ORDER BY r.created_at DESC`;

        const result = await pool.query(query, values);

        res.json({
            count: result.rows.length,
            requests: result.rows,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch requests",
        });
    }
};


// GET SINGLE REQUEST
const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
        r.id,
        r.title,
        r.description,

        r.created_by AS created_by_id,

        c.name AS category,

        creator.name AS created_by,

        assignee.id AS assigned_to_id,
        assignee.name AS assigned_to,

        r.priority,
        r.status,
        r.created_at,
        r.updated_at

       FROM requests r

       JOIN categories c
         ON r.category_id = c.id

       JOIN users creator
         ON r.created_by = creator.id

       LEFT JOIN users assignee
         ON r.assigned_to = assignee.id

       WHERE r.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Request not found",
            });
        }

        const request = result.rows[0];

        if (
            req.user.role !== "admin" &&
            request.created_by_id !== req.user.id
        ) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        res.json(request);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch request",
        });
    }
};


// UPDATE REQUEST
const updateRequest = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        const {
            status,
            assigned_to,
            priority,
        } = req.body;

        await client.query("BEGIN");

        const oldRequest = await client.query(
            "SELECT * FROM requests WHERE id = $1",
            [id]
        );

        if (oldRequest.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Request not found",
            });
        }

        const request = oldRequest.rows[0];

        const newStatus =
            status !== undefined
                ? status
                : request.status;

        const newAssignedTo =
            assigned_to !== undefined
                ? assigned_to
                : request.assigned_to;

        const newPriority =
            priority !== undefined
                ? priority
                : request.priority;


        const updated = await client.query(
            `UPDATE requests
       SET
         status = $1,
         assigned_to = $2,
         priority = $3,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
            [
                newStatus,
                newAssignedTo,
                newPriority,
                id,
            ]
        );


        // Record status change in history
        if (newStatus !== request.status) {
            await client.query(
                `INSERT INTO request_status_history
         (
           request_id,
           old_status,
           new_status,
           changed_by
         )
         VALUES ($1, $2, $3, $4)`,
                [
                    id,
                    request.status,
                    newStatus,
                    req.user.id,
                ]
            );
        }


        await client.query("COMMIT");

        res.json({
            message: "Request updated successfully",
            request: updated.rows[0],
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Failed to update request",
        });

    } finally {
        client.release();
    }
};


// DELETE REQUEST
const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM requests WHERE id = $1 RETURNING id",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Request not found",
            });
        }

        res.json({
            message: "Request deleted successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete request",
        });
    }
};


module.exports = {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
};