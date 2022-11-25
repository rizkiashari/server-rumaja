const { Router } = require("express");
const { addUlasan, getAllUlasanPencari } = require("../controllers/ulasanController");

const { authMiddleware } = require("../middlewares/auth");
const router = Router();

router.post("/add", authMiddleware, addUlasan);
router.get("/all", authMiddleware, getAllUlasanPencari);

module.exports = router;
