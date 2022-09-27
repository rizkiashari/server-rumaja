const { Router } = require("express");
const auth = require("./auth.js");
const user = require("./user.js");
const pendidikan = require("./pendidikan.js");
const pekerjaan = require("./pekerjaan.js");
const router = Router();

router.get("/test", (req, res) => {
  res.send({ data: "Service Success Running" });
});

router.use("/auth", auth);
router.use("/user", user);
router.use("/pendidikan", pendidikan);
router.use("/pekerjaan", pekerjaan);

module.exports = router;
