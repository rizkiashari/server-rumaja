const { Router } = require("express");
const {
  addLowongan,
  getAllPekerjaan,
  getByUUIDPekerjaan,
  editLowongan,
  deletePekerjaan,
  savePekerjaan,
  rekomendasiPekerjaan,
  listsLayanan,
  getPekerjaanByBidangKerja,
} = require("../controllers/lowonganController");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();

router.post("/add", authMiddleware, addLowongan);
router.patch("/update/:uuid_lowongan", authMiddleware, editLowongan);
router.get("/list-pekerjaan", authMiddleware, getAllPekerjaan);
router.get("/id/:uuid_kerja", authMiddleware, getByUUIDPekerjaan);
router.delete("/delete/:uuid_kerja", authMiddleware, deletePekerjaan);
router.patch("/save/:uuid_kerja", authMiddleware, savePekerjaan);
router.get("/rekomendasi", authMiddleware, rekomendasiPekerjaan);
router.get("/list-pekerjaan/:bidang_kerja", authMiddleware, getPekerjaanByBidangKerja);
router.get("/layanan", authMiddleware, listsLayanan);

module.exports = router;
