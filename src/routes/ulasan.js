const { Router } = require("express");
const { addUlasan } = require("../controllers/ulasanController");

const { authMiddleware } = require("../middlewares/auth");
const router = Router();

router.post("/add", authMiddleware, addUlasan);

module.exports = router;
