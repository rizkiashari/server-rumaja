const {
  tolakLamaran,
  appliedPekerjaan,
  terimaLamaran,
  getAllApplied,
  getAllPelamar,
  getDaftarPelamar,
  getProgressLamaran,
  getAllProgress,
  akhiriPekerjaan,
  dataProgressKerja,
  detailLamaranTerkirim,
  getDataPekerjaanSelesai,
  pelamarMulaiBekerja,
} = require("../controllers/lamaranController");
const { authMiddleware } = require("../middlewares/auth");

const { Router } = require("express");

const router = Router();

router.patch("/tolak/:uuid_riwayat", authMiddleware, tolakLamaran);
router.patch("/terima/:uuid_riwayat", authMiddleware, terimaLamaran);
router.post("/applied", authMiddleware, appliedPekerjaan);
router.get("/applied-all", authMiddleware, getAllApplied);
router.get("/pelamar", authMiddleware, getAllPelamar);

router.get("/daftar-pelamar/:id_lowongan", authMiddleware, getDaftarPelamar);

router.get("/progres-lamaran/:id_riwayat", authMiddleware, getProgressLamaran);
router.get("/progres", authMiddleware, getAllProgress);

router.patch("/akhiri-pekerjaan/:id_riwayat", authMiddleware, akhiriPekerjaan);

router.get("/progres-kerja/:uuid_riwayat", authMiddleware, dataProgressKerja);

router.get("/detail-lamaran/:uuid_riwayat", authMiddleware, detailLamaranTerkirim);

router.get("/selesai/:uuid_riwayat", authMiddleware, getDataPekerjaanSelesai);

router.patch("/mulai-bekerja/:uuid_riwayat", authMiddleware, pelamarMulaiBekerja);

module.exports = router;
