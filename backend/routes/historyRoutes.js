const express = require("express");

const {
    getRequestHistory,
} = require("../controllers/historyController");

const {
    authenticateToken,
} = require("../middleware/auth");

const router = express.Router();

router.get(
    "/:id",
    authenticateToken,
    getRequestHistory
);

module.exports = router;