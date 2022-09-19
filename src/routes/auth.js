const { Router } = require("express");
const { register, login } = require("../controllers/authController.js");

const router = Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
