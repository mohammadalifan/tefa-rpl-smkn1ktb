const express = require("express");
const siswaController = require("../controllers/siswa-controller");
const { requireAuth } = require("../middlewares/auth-middleware");

const router = express.Router();

router.use(requireAuth);
router.get("/", siswaController.index);

module.exports = router;
