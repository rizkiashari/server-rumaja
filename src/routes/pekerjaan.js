const { Router } = require("express");
const { addPekerjaan } = require("../controllers/pekerjaanController");

const router = Router();

router.post("/add", addPekerjaan);

module.exports = router;
