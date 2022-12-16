const { Router } = require("express");
const { authMiddleware } = require("../middlewares/auth");
const {
  getAllDaftarNotifikasi,
  countNotifikasi,
} = require("../controllers/notifikasiController");

const router = Router();

router.get("/", authMiddleware, getAllDaftarNotifikasi);
router.get("/count", authMiddleware, countNotifikasi);

module.exports = router;
