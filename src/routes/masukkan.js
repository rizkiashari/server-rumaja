const { Router } = require("express");
const { addMasukkan } = require("../controllers/masukkanController");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();

router.post("/add", authMiddleware, addMasukkan);

module.exports = router;
