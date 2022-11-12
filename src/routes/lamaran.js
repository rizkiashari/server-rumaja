const { tolakLamaran, tawarkanPekerjaan } = require("../controllers/lamaranController");
const { authMiddleware } = require("../middlewares/auth");

const { Router } = require("express");

const router = Router();

router.post("/tolak", authMiddleware, tolakLamaran);
router.post("/tawarkan", authMiddleware, tawarkanPekerjaan);

module.exports = router;
