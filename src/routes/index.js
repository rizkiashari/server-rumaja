const { Router } = require("express");
const auth = require("./auth.js");
const user = require("./user.js");
const pendidikan = require("./pendidikan.js");
const router = Router();

router.get("/test", (req, res) => {
  res.send("Service Success Running");
});

router.use("/auth", auth);
router.use("/user", user);
router.use("/pendidikan", pendidikan);

module.exports = router;
