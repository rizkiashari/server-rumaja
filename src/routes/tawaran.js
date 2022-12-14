const { Router } = require("express");

const {
  tawarkanPekerjaan,
  getAllTawarkanProses,
  getAllTawaranTerkirim,
  getDaftarTawaranTerkirim,
  getProgressTawaranTerkirim,
  tolakTawaran,
  terimaTawaran,
  detailTawaranPekerjaan,
  dataProgressPencari,
} = require("../controllers/tawarkanController.js");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();
router.patch("/tolak/:uuid_riwayat", authMiddleware, tolakTawaran);
router.patch("/terima/:uuid_riwayat", authMiddleware, terimaTawaran);
router.post("/tawarkan-pekerjaan", authMiddleware, tawarkanPekerjaan);
router.get("/tawarkan-all", authMiddleware, getAllTawarkanProses);
router.get("/tawaran-terkirim", authMiddleware, getAllTawaranTerkirim);

router.get("/daftar-terkirim/:id_lowongan", authMiddleware, getDaftarTawaranTerkirim);

router.get("/progres-tawaran/:id_riwayat", authMiddleware, getProgressTawaranTerkirim);

router.get("/detail-tawaran/:uuid_riwayat", authMiddleware, detailTawaranPekerjaan);

router.get("/progres-pencari", authMiddleware, dataProgressPencari);

module.exports = router;
