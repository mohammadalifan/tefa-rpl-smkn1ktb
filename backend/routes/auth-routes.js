const express = require("express");
const { login, logout, currentUser } = require("../controllers/auth-controller");
const { requireAuth } = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/login", login);
router.post("/logout", requireAuth, logout);
router.get("/me", currentUser);

module.exports = router;
