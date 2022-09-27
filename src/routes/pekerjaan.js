const { Router } = require("express");
const { addPekerjaan, getAllPekerjaan } = require("../controllers/pekerjaanController");

const router = Router();

router.get("/all-pekerjaan", getAllPekerjaan);
router.post("/add", addPekerjaan);

module.exports = router;
