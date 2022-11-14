const { Router } = require("express");

const { tawarkanPekerjaan } = require("../controllers/tawarkanController.js");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();
router.post("/tawarkan-pekerjaan", authMiddleware, tawarkanPekerjaan);
module.exports = router;
