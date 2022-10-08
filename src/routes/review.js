const { Router } = require("express");
const { addReviewPencari } = require("../controllers/reviewController");
const { authMiddleware } = require("../middlewares/auth");

const router = Router();

router.post("/add", authMiddleware, addReviewPencari);

module.exports = router;
