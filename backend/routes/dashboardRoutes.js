const express = require("express");

const {
    getDashboardStats,
    getRequestsByCategory,
} = require("../controllers/dashboardController");

const {
    authenticateToken,
    authorizeRoles,
} = require("../middleware/auth");

const router = express.Router();

router.get(
    "/stats",
    authenticateToken,
    authorizeRoles("admin"),
    getDashboardStats
);

router.get(
    "/by-category",
    authenticateToken,
    authorizeRoles("admin"),
    getRequestsByCategory
);

module.exports = router;