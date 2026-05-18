const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middlewares/auth-middleware");
const {
  getAllUsers,
  getAllContacts,
  deleteUser,
  deleteContact,
} = require("../controllers/admin-controller");

// All admin routes require auth + admin
router.use(authMiddleware, adminMiddleware);

router.get("/users", getAllUsers);
router.get("/contacts", getAllContacts);
router.delete("/users/:id", deleteUser);
router.delete("/contacts/:id", deleteContact);

module.exports = router;