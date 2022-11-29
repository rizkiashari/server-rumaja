const { Router } = require("express");

const {
  tawarkanPekerjaan,
  getAllTawarkan,
} = require("../controllers/tawarkanController.js");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();
router.post("/tawarkan-pekerjaan", authMiddleware, tawarkanPekerjaan);
router.get("/tawarkan-all", authMiddleware, getAllTawarkan);

module.exports = router;
