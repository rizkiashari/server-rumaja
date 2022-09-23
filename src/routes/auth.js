const { Router } = require("express");
const {
  register,
  login,
  logout,
  refreshToken,
} = require("../controllers/authController.js");

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh-token", refreshToken);

module.exports = router;
