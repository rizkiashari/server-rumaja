const { Router } = require("express");
const {
  addPendidikan,
  listAllPendidikan,
  editPendidikan,
  deletePendidikan,
  getPendidikanByUUID,
} = require("../controllers/pendidikanController");

const router = Router();

router.post("/add", addPendidikan);
router.patch("/edit/:uuid_pendidikan", editPendidikan);
router.get("/id/:uuid_pendidikan", getPendidikanByUUID);
router.get("/list-all", listAllPendidikan);
router.delete("/delete/:uuid_pendidikan", deletePendidikan);

module.exports = router;
