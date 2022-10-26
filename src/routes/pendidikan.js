const { Router } = require("express");
const {
  addPendidikan,
  listsAllPendidikan,
  editPendidikan,
  deletePendidikan,
  getPendidikanByUUID,
} = require("../controllers/pendidikanController");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();

router.post("/add", authMiddleware, addPendidikan);
router.patch("/edit/:uuid_pendidikan", authMiddleware, editPendidikan);
router.get("/id/:uuid_pendidikan", authMiddleware, getPendidikanByUUID);
router.get("/list-all", authMiddleware, listsAllPendidikan);
router.delete("/delete/:uuid_pendidikan", authMiddleware, deletePendidikan);

module.exports = router;
