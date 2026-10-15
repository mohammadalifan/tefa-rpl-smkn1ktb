const express = require("express");
const guruController = require("../controllers/guru-controller");
const { requireAuth } = require("../middlewares/auth-middleware");

const router = express.Router();

router.use(requireAuth);
router.get("/", guruController.index);
router.post("/", guruController.store);
router.patch("/:id", guruController.update);
router.delete("/:id", guruController.destroy);

module.exports = router;
