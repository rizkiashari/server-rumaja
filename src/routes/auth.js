const { Router } = require("express");
const {
  register,
  login,
  logout,
  refreshToken,
  checkAuth,
} = require("../controllers/authController.js");

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/check-auth", checkAuth);

module.exports = router;
