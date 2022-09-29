const { Router } = require("express");
const {
  provinsi,
  kota,
  detailProvinsi,
  detailKota,
} = require("../controllers/wilayahIndoController");

const router = Router();

router.get("/provinsi", provinsi);
router.get("/kota", kota);
router.get("/kota/:id_kota", detailKota);
router.get("/provinsi/:id_provinsi", detailProvinsi);

module.exports = router;
