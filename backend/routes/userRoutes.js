const express = require("express");

const {
    getAdmins,
    getEmployees,
    getUsers,
    createUser,
} = require("../controllers/userController");

const {
    authenticateToken,
    authorizeRoles,
} = require("../middleware/auth");

const router = express.Router();


// Get administrators
router.get(
    "/admins",
    authenticateToken,
    authorizeRoles("admin"),
    getAdmins
);


// Get employees
router.get(
    "/employees",
    authenticateToken,
    authorizeRoles("admin"),
    getEmployees
);


// Get all users
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    getUsers
);


// Create a new user
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    createUser
);


module.exports = router;