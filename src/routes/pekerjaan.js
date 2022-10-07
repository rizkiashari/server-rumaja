const { Router } = require("express");
const {
  addPekerjaan,
  getAllPekerjaan,
  getByUUIDPekerjaan,
  editPekerjaan,
  deletePekerjaan,
  getAllPekerjanWithLimit,
  savePekerjaan,
  rekomendasiPekerjaan,
} = require("../controllers/pekerjaanController");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();

router.post("/add", authMiddleware, addPekerjaan);
router.get("/list-pekerjaan", authMiddleware, getAllPekerjaan);
router.get("/list-pekerjaan/:limit", authMiddleware, getAllPekerjanWithLimit);
router.get("/id/:uuid_kerja", authMiddleware, getByUUIDPekerjaan);
router.patch("/update/:uuid_kerja", authMiddleware, editPekerjaan);
router.delete("/delete/:uuid_kerja", authMiddleware, deletePekerjaan);
router.patch("/save/:uuid_kerja", authMiddleware, savePekerjaan);
router.get("/rekomendasi", authMiddleware, rekomendasiPekerjaan);

module.exports = router;
