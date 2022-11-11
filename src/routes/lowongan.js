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
  publishLowongan,
} = require("../controllers/lowonganController");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();

// PENYEDIA
router.post("/add", authMiddleware, addLowongan);
router.get("/list-lowongan", authMiddleware, getAllLowongan);
router.delete("/delete/:uuid_lowongan", authMiddleware, deleteLowongan);
router.patch("/update/:uuid_lowongan", authMiddleware, editLowongan);
router.patch("/publish/:uuid_lowongan", authMiddleware, publishLowongan);

// PENCARI
router.patch("/save/:uuid_kerja", authMiddleware, savePekerjaan);
router.get("/rekomendasi", authMiddleware, rekomendasiPekerjaan);
router.get("/list-pekerjaan/:bidang_kerja", authMiddleware, getPekerjaanByBidangKerja);

// GLOBAL
router.get("/layanan", authMiddleware, listsLayanan);
router.get("/id/:uuid_lowongan", authMiddleware, getByUUIDLowongan);

module.exports = router;
