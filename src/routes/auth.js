const { Router } = require("express");
const { register, login, logout } = require("../controllers/authController.js");

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
