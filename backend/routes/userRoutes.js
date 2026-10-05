const express = require("express");

const {
    getAdmins,
} = require("../controllers/userController");

const {
    authenticateToken,
    authorizeRoles,
} = require("../middleware/auth");

const router = express.Router();

router.get(
    "/admins",
    authenticateToken,
    authorizeRoles("admin"),
    getAdmins
);

module.exports = router;