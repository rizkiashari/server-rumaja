const { Router } = require("express");
const { getAllUser } = require("../controllers/userController");

const router = Router();

router.get("/all", getAllUser);

module.exports = router;
