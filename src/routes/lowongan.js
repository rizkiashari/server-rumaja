const { Router } = require("express");
const {
  addLowongan,
  getAllLowongan,
  getByUUIDLowongan,
  editLowongan,
  deleteLowongan,
  savePekerjaan,
  rekomendasiPekerjaan,
  listsLayanan,
  getPekerjaanByBidangKerja,
} = require("../controllers/lowonganController");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();

router.post("/add", authMiddleware, addLowongan);
router.patch("/update/:uuid_lowongan", authMiddleware, editLowongan);
router.get("/list-lowongan", authMiddleware, getAllLowongan);
router.get("/id/:uuid_lowongan", authMiddleware, getByUUIDLowongan);
router.delete("/delete/:uuid_lowongan", authMiddleware, deleteLowongan);
router.patch("/save/:uuid_kerja", authMiddleware, savePekerjaan);
router.get("/rekomendasi", authMiddleware, rekomendasiPekerjaan);
router.get("/list-pekerjaan/:bidang_kerja", authMiddleware, getPekerjaanByBidangKerja);
router.get("/layanan", authMiddleware, listsLayanan);

module.exports = router;
