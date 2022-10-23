const { Router } = require("express");
const {
  addPekerjaan,
  getAllPekerjaan,
  getByUUIDPekerjaan,
  editPekerjaan,
  deletePekerjaan,
  savePekerjaan,
  rekomendasiPekerjaan,
  listsLayanan,
  getPekerjaanByBidangKerja,
} = require("../controllers/pekerjaanController");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();

router.post("/add", authMiddleware, addPekerjaan);
router.get("/list-pekerjaan", authMiddleware, getAllPekerjaan);
router.get("/id/:uuid_kerja", authMiddleware, getByUUIDPekerjaan);
router.patch("/update/:uuid_kerja", authMiddleware, editPekerjaan);
router.delete("/delete/:uuid_kerja", authMiddleware, deletePekerjaan);
router.patch("/save/:uuid_kerja", authMiddleware, savePekerjaan);
router.get("/rekomendasi", authMiddleware, rekomendasiPekerjaan);
router.get("/list-pekerjaan/:bidang_kerja", authMiddleware, getPekerjaanByBidangKerja);
router.get("/layanan", authMiddleware, listsLayanan);

module.exports = router;
