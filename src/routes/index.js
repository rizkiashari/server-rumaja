const { Router } = require("express");
const auth = require("./auth.js");
const user = require("./user.js");
const pendidikan = require("./pendidikan.js");
const wilayahIndonesia = require("./wilayahIndo.js");
const lowongan = require("./lowongan.js");
const lamaran = require("./lamaran.js");
const tawarkan = require("./tawaran.js");
const pengalaman = require("./pengalaman.js");
const ulasan = require("./ulasan.js");
const masukkan = require("./masukkan.js");
const notifikasi = require("./notifikasi.js");
const router = Router();

router.get("/test", (req, res) => {
  res.send({ data: "Service Success Running!!" });
});

router.use("/auth", auth);
router.use("/user", user);
router.use("/pendidikan", pendidikan);
router.use("/lowongan", lowongan);
router.use("/lamaran", lamaran);
router.use("/tawarkan", tawarkan);
router.use("/pengalaman", pengalaman);
router.use("/ulasan", ulasan);
router.use("/masukkan", masukkan);
router.use("/notifikasi", notifikasi);

router.use("/wilayah-indo", wilayahIndonesia);

module.exports = router;
