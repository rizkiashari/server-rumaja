const { Router } = require("express");

const {
  tawarkanPekerjaan,
  getAllTawarkan,
  getAllTawaranTerkirim,
} = require("../controllers/tawarkanController.js");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();
router.post("/tawarkan-pekerjaan", authMiddleware, tawarkanPekerjaan);
router.get("/tawarkan-all", authMiddleware, getAllTawarkan);
router.get("/tawaran-terkirim", authMiddleware, getAllTawaranTerkirim);

module.exports = router;
