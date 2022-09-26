const { Router } = require("express");
const { listBidangKerja } = require("../controllers/bidangKerjaController");
const { getAllUser } = require("../controllers/userController");

const router = Router();

router.get("/all", getAllUser);
router.get("/list-kerja", listBidangKerja);

module.exports = router;
