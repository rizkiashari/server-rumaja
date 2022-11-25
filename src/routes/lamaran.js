const {
  tolakLamaran,
  appliedPekerjaan,
  terimaLamaran,
  getAllApplied,
} = require("../controllers/lamaranController");
const { authMiddleware } = require("../middlewares/auth");

const { Router } = require("express");

const router = Router();

router.patch("/tolak/:uuid_riwayat", authMiddleware, tolakLamaran);
router.patch("/terima/:uuid_riwayat", authMiddleware, terimaLamaran);
router.post("/applied", authMiddleware, appliedPekerjaan);
router.get("/applied-all", authMiddleware, getAllApplied);

module.exports = router;
