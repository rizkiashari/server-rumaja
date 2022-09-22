const { Router } = require("express");
const { addPendidikan } = require("../controllers/pendidikanController");

const router = Router();

router.post("/add", addPendidikan);

module.exports = router;
