const express = require("express");

const {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
} = require("../controllers/requestController");

const {
    authenticateToken,
    authorizeRoles,
} = require("../middleware/auth");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    createRequest
);

router.get(
    "/",
    authenticateToken,
    getRequests
);

router.get(
    "/:id",
    authenticateToken,
    getRequestById
);

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    updateRequest
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    deleteRequest
);

module.exports = router;