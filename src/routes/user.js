const { Router } = require("express");
const { listBidangKerja } = require("../controllers/bidangKerjaController");
const {
  findEmailResetPassword,
  changePassword,
} = require("../controllers/changePasswordController");
const {
  updateUserPenyedia,
  updateUserPencari,
  listRekomendasiUserPencari,
  updatePassword,
  detailUserPencari,
  profilePencari,
  profilePenyedia,
  savePencari,
  unSavePencari,
  pencariByBidangKerja,
  getDataSavePencari,
  detailProfilePenyedia,
  detailProfilePencari,
  updatePhotoProfile,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

const router = Router();

// router.get("/all", authMiddleware, getAllUser);
router.post("/forgot-password", findEmailResetPassword);
router.post("/change-password", changePassword);
// router.patch("/update-password", authMiddleware, updatePassword);
router.post(
  "/update-photo",
  authMiddleware,
  uploadFile("photo_profile"),
  updatePhotoProfile
);

router.get("/rekomendasi-pencari", authMiddleware, listRekomendasiUserPencari);
router.post("/update/pencari", authMiddleware, updateUserPencari);
router.post("/update/penyedia", authMiddleware, updateUserPenyedia);

router.post("/save-pencari", authMiddleware, savePencari);
router.patch("/unsave-pencari/:uuid_simpan", authMiddleware, unSavePencari);

router.get("/pencari/all-save", authMiddleware, getDataSavePencari);
router.get("/pencari/:bidang_kerja", authMiddleware, pencariByBidangKerja);

router.get("/detail/pencari/:uuid_user", authMiddleware, detailUserPencari);

router.get("/list-bidang", listBidangKerja);

router.get("/profile-pencari", authMiddleware, profilePencari);
router.get("/profile-penyedia", authMiddleware, profilePenyedia);

router.get("/detail-penyedia/:uuid_user", authMiddleware, detailProfilePenyedia);
router.get("/detail-pencari/:uuid_user", authMiddleware, detailProfilePencari);

module.exports = router;
