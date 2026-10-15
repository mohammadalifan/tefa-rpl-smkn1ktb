const express = require("express");
const guruController = require("../controllers/guru-controller");
const { requireAuth } = require("../middlewares/auth-middleware");

const router = express.Router();

router.use(requireAuth);
router.get("/", guruController.index);

module.exports = router;
