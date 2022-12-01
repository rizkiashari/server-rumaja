const { Router } = require("express");
const {
  register,
  login,
  logout,
  refreshToken,
  checkAuth,
  checkPassword,
  changePassword,
} = require("../controllers/authController.js");
const { authMiddleware } = require("../middlewares/auth.js");

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/check-auth", authMiddleware, checkAuth);

router.post("/check-password", authMiddleware, checkPassword);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
