const { Router } = require("express");
const { listBidangKerja } = require("../controllers/bidangKerjaController");
const {
  findEmailResetPassword,
  changePassword,
} = require("../controllers/changePasswordController");
const {
  getAllUser,
  updateUserPenyedia,
  updateUserPencari,
  listUserPencari,
  updatePassword,
  detailUserPencari,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();

router.get("/all", authMiddleware, getAllUser);
router.post("/forgot-password", findEmailResetPassword);
router.post("/change-password", changePassword);
router.patch("/update-password", authMiddleware, updatePassword);

router.get("/all-pencari", listUserPencari);
router.post("/update/pencari", authMiddleware, updateUserPencari);
router.post("/update/penyedia", authMiddleware, updateUserPenyedia);
router.get("/detail/pencari/:uuid_user", authMiddleware, detailUserPencari);

router.get("/list-kerja", listBidangKerja);

module.exports = router;
