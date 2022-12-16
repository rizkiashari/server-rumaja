const { Router } = require("express");
const { authMiddleware } = require("../middlewares/auth");
const {
  getAllDaftarNotifikasi,
  countNotifikasi,
  readNotifikasi,
} = require("../controllers/notifikasiController");

const router = Router();

router.get("/", authMiddleware, getAllDaftarNotifikasi);
router.get("/count", authMiddleware, countNotifikasi);
router.patch("/read/:id", authMiddleware, readNotifikasi);

module.exports = router;
