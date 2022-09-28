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
} = require("../controllers/userController");

const router = Router();

router.get("/all", getAllUser);
router.post("/forgot-password", findEmailResetPassword);
router.post("/change-password", changePassword);

router.get("/all-pencari", listUserPencari);
router.post("/update/pencari", updateUserPencari);
router.post("/update/penyedia", updateUserPenyedia);

router.get("/list-kerja", listBidangKerja);

module.exports = router;
