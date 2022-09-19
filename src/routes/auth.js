const { Router } = require("express");
const { register } = require("../controllers/authController.js");

const router = Router();

router.post("/register", register);

module.exports = router;
