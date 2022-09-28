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

const router = Router();

router.post("/add", addPekerjaan);
router.get("/list-pekerjaan", getAllPekerjaan);
router.get("/list-pekerjaan/:limit", getAllPekerjanWithLimit);
router.get("/id/:uuid_kerja", getByUUIDPekerjaan);
router.patch("/update/:uuid_kerja", editPekerjaan);
router.delete("/delete/:uuid_kerja", deletePekerjaan);
router.patch("/save/:uuid_kerja", savePekerjaan);
router.get("/rekomendasi/:lokasi", rekomendasiPekerjaan);

module.exports = router;
