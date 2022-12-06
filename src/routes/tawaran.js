const { Router } = require("express");

const {
  tawarkanPekerjaan,
  getAllTawarkan,
  getAllTawaranTerkirim,
  getDaftarTawaranTerkirim,
  getProgressTawaranTerkirim,
} = require("../controllers/tawarkanController.js");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();
router.post("/tawarkan-pekerjaan", authMiddleware, tawarkanPekerjaan);
router.get("/tawarkan-all", authMiddleware, getAllTawarkan);
router.get("/tawaran-terkirim", authMiddleware, getAllTawaranTerkirim);

router.get("/daftar-terkirim/:id_lowongan", authMiddleware, getDaftarTawaranTerkirim);

router.get("/progres-tawaran/:id_riwayat", authMiddleware, getProgressTawaranTerkirim);

module.exports = router;
