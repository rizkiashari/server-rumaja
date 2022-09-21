const { Router } = require("express");
const auth = require("./auth.js");
const user = require("./user");
const router = Router();

router.get("/test", (req, res) => {
  res.send("Test route");
});

router.use("/auth", auth);
router.use("/user", user);

module.exports = router;
