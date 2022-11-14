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
  profilePencari,
  profilePenyedia,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

const router = Router();

router.get("/all", authMiddleware, getAllUser);
router.post("/forgot-password", findEmailResetPassword);
router.post("/change-password", changePassword);
router.patch("/update-password", authMiddleware, updatePassword);

router.get("/all-pencari", listUserPencari);
router.post(
  "/update/pencari",
  authMiddleware,
  uploadFile("photo_profile"),
  updateUserPencari
);
router.post(
  "/update/penyedia",
  authMiddleware,
  uploadFile("photo_profile"),
  updateUserPenyedia
);
router.get("/detail/pencari/:uuid_user", authMiddleware, detailUserPencari);

router.get("/list-bidang", listBidangKerja);

router.get("/profile-pencari", authMiddleware, profilePencari);
router.get("/profile-penyedia", authMiddleware, profilePenyedia);

module.exports = router;
