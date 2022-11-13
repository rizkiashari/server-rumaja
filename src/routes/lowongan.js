const { Router } = require("express");
const {
  addLowongan,
  getAllLowongan,
  getByUUIDLowongan,
  editLowongan,
  deleteLowongan,
  saveLowongan,
  rekomendasiLowongan,
  listsLayanan,
  getLowonganByBidangKerja,
  publishLowongan,
  deleteSaveLowongan,
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
router.patch("/save/:uuid_lowongan", authMiddleware, saveLowongan);
router.delete("/delete/save/:uuid_simpan", authMiddleware, deleteSaveLowongan);
router.get("/rekomendasi", authMiddleware, rekomendasiLowongan);
router.get("/list/:bidang_kerja", authMiddleware, getLowonganByBidangKerja);

// GLOBAL
router.get("/layanan", authMiddleware, listsLayanan);
router.get("/id/:uuid_lowongan", authMiddleware, getByUUIDLowongan);

module.exports = router;
