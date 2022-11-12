const { Router } = require("express");
const auth = require("./auth.js");
const user = require("./user.js");
const pendidikan = require("./pendidikan.js");
const wilayahIndonesia = require("./wilayahIndo.js");
const lowongan = require("./lowongan.js");
const lamaran = require("./lamaran.js");
const router = Router();

router.get("/test", (req, res) => {
  res.send({ data: "Service Success Running" });
});

router.use("/auth", auth);
router.use("/user", user);
router.use("/pendidikan", pendidikan);
router.use("/lowongan", lowongan);
router.use("/lamaran", lamaran);

router.use("/wilayah-indo", wilayahIndonesia);

module.exports = router;
