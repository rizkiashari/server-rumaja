const { Router } = require("express");
const {
  addPengalaman,
  editPengalaman,
  getPengalamanByUUID,
  listAllPengalaman,
  deletePengalaman,
  changeStatusIsPengalaman,
} = require("../controllers/pengalamanController");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();

router.post("/add", authMiddleware, addPengalaman);
router.patch("/edit/:uuid_pengalaman", authMiddleware, editPengalaman);
router.get("/id/:uuid_pengalaman", authMiddleware, getPengalamanByUUID);
router.get("/list-all", authMiddleware, listAllPengalaman);
router.delete("/delete/:uuid_pengalaman", authMiddleware, deletePengalaman);

router.patch("/ulasan/:uuid_riwayat", authMiddleware, changeStatusIsPengalaman);

module.exports = router;
