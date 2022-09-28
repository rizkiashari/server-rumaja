const { Router } = require("express");
const {
  addPekerjaan,
  getPekerjaanWithLimit,
  getByUUIDPekerjaan,
  editPekerjaan,
  deletePekerjaan,
} = require("../controllers/pekerjaanController");

const router = Router();

router.post("/add", addPekerjaan);
router.get("/list-pekerjaan", getPekerjaanWithLimit);
router.get("/id/:uuid_kerja", getByUUIDPekerjaan);
router.patch("/update/:uuid_kerja", editPekerjaan);
router.delete("/delete/:uuid_kerja", deletePekerjaan);

module.exports = router;
