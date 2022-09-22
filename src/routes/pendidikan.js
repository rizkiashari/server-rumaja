const { Router } = require("express");
const {
  addPendidikan,
  listAllPendidikan,
  editPendidikan,
  deletePendidikan,
} = require("../controllers/pendidikanController");

const router = Router();

router.post("/add", addPendidikan);
router.patch("/edit/:uuid_pendidikan", editPendidikan);
router.get("/list-all", listAllPendidikan);
router.delete("/delete/:uuid_pendidikan", deletePendidikan);

module.exports = router;
