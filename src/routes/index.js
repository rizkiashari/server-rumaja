const { Router } = require("express");
const auth = require("./auth.js");
const router = Router();

router.get("/test", (req, res) => {
  res.send("Test route");
});

router.use("/auth", auth);

module.exports = router;
